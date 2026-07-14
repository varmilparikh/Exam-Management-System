import prisma from "../config/prisma.js";
import swapRequestRepository from "../repositories/swapRequest.repository.js";
import employeeRepository from "../repositories/employee.repository.js";
import examDutyRepository from "../repositories/examDuty.repository.js";
import activityLogService from "./activityLog.service.js";
import notificationService from "./notification.service.js";

import { ApiError } from "../utils/apiError.js";

import {
  ActivityAction,
  DutyStatus,
  EntityType,
  ExamStatus,
  Role,
  SwapStatus,
} from "../generated/prisma/client.js";

import type {
  CreateSwapRequestDto,
  ApproveSwapRequestDto,
  RejectSwapRequestDto,
  CancelSwapRequestDto,
} from "../types/swapRequest.types.js";
import {
  swapRequestSelect,
  type SwapRequestResponse,
} from "../constants/prismaSelect.js";

class SwapRequestService {
  /**
   * Faculty requests a duty swap
   */
  async requestSwap(
    requesterId: string,
    data: CreateSwapRequestDto,
  ): Promise<SwapRequestResponse> {
    const requester = await employeeRepository.findById(requesterId);

    if (!requester) {
      throw new ApiError(404, "Requester not found");
    }

    if (!requester.isActive) {
      throw new ApiError(400, "Requester is inactive");
    }

    const receiver = await employeeRepository.findById(data.receiverId);

    if (!receiver) {
      throw new ApiError(404, "Receiver not found");
    }

    if (!receiver.isActive) {
      throw new ApiError(400, "Receiver is inactive");
    }

    if (requester.id === receiver.id) {
      throw new ApiError(400, "You cannot swap duties with yourself.");
    }

    const requesterDuty = await examDutyRepository.findById(
      data.requesterDutyId,
    );

    if (!requesterDuty) {
      throw new ApiError(404, "Requester duty not found");
    }

    const receiverDuty = await examDutyRepository.findById(data.receiverDutyId);

    if (!receiverDuty) {
      throw new ApiError(404, "Receiver duty not found");
    }

    if (requesterDuty.employeeId !== requesterId) {
      throw new ApiError(403, "Requester does not own the selected duty.");
    }

    if (receiverDuty.employeeId !== receiver.id) {
      throw new ApiError(403, "Receiver does not own the selected duty.");
    }

    if (requesterDuty.status !== DutyStatus.ASSIGNED) {
      throw new ApiError(400, "Requester duty is not assigned.");
    }

    if (receiverDuty.status !== DutyStatus.ASSIGNED) {
      throw new ApiError(400, "Receiver duty is not assigned.");
    }

    if (requesterDuty.exam.status !== ExamStatus.UPCOMING) {
      throw new ApiError(400, "Requester exam is not upcoming.");
    }

    if (receiverDuty.exam.status !== ExamStatus.UPCOMING) {
      throw new ApiError(400, "Receiver exam is not upcoming.");
    }

    const existingRequest = await swapRequestRepository.findPendingByDuties(
      data.requesterDutyId,
      data.receiverDutyId,
    );

    if (existingRequest) {
      throw new ApiError(409, "A pending swap request already exists.");
    }

    if (requesterDuty.examId === receiverDuty.examId) {
      throw new ApiError(400, "Cannot swap duties for the same examination.");
    }

    const swapRequest = await swapRequestRepository.create({
      requester: {
        connect: {
          id: requesterId,
        },
      },

      receiver: {
        connect: {
          id: receiver.id,
        },
      },

      requesterDuty: {
        connect: {
          id: requesterDuty.id,
        },
      },

      receiverDuty: {
        connect: {
          id: receiverDuty.id,
        },
      },

      status: SwapStatus.PENDING,

      reason: data.reason,
    });
    await activityLogService.log({
      employeeId: requesterId,

      action: ActivityAction.CREATE_SWAP_REQUEST,

      description: `${requester.name} requested a duty swap with ${receiver.name}.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: swapRequest.id,
    });

    await notificationService.create({
      employeeId: receiver.id,

      title: "Swap Request Received",

      message: `${requester.name} has requested to swap examination duties with you.`,
    });

    return swapRequest;
  }

  /**
   * Receiver accepts swap request
   */
  async acceptSwap(
    id: string,
    receiverId: string,
  ): Promise<SwapRequestResponse> {
    const swapRequest = await swapRequestRepository.findById(id);

    if (!swapRequest) {
      throw new ApiError(404, "Swap request not found");
    }

    const receiver = await employeeRepository.findById(receiverId);

    if (!receiver) {
      throw new ApiError(404, "Receiver not found");
    }

    if (!receiver.isActive) {
      throw new ApiError(400, "Receiver account is inactive");
    }

    if (swapRequest.status !== SwapStatus.PENDING) {
      throw new ApiError(400, "Only pending swap requests can be accepted.");
    }

    const updatedSwapRequest = await swapRequestRepository.update(id, {
      status: SwapStatus.ACCEPTED,
    });

    await activityLogService.log({
      employeeId: receiverId,

      action: ActivityAction.ACCEPT_SWAP_REQUEST,

      description: `${updatedSwapRequest.receiver.name} accepted the swap request from ${updatedSwapRequest.requester.name}.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    const coes = await employeeRepository.findByRole(Role.COE);

    for (const coe of coes) {
      await notificationService.create({
        employeeId: coe.id,

        title: "Swap Request Awaiting Approval",

        message: `${updatedSwapRequest.requester.name} and ${updatedSwapRequest.receiver.name} have agreed to swap examination duties. Approval is required.`,
      });
    }

    return updatedSwapRequest;
  }

  /**
   * COE approves swap request
   */
  async approveSwap(
    id: string,
    approvedById: string,
    data: ApproveSwapRequestDto,
  ): Promise<SwapRequestResponse> {
    // 1. Check approver
    const approver = await employeeRepository.findById(approvedById);

    if (!approver) {
      throw new ApiError(404, "Approver not found");
    }

    if (!approver.isActive) {
      throw new ApiError(400, "Approver account is inactive");
    }

    // 2. Find swap request
    const swapRequest = await swapRequestRepository.findById(id);

    if (!swapRequest) {
      throw new ApiError(404, "Swap request not found");
    }

    // 3. Request must be accepted
    if (swapRequest.status !== SwapStatus.ACCEPTED) {
      throw new ApiError(400, "Only accepted swap requests can be approved.");
    }

    // 4. Load both duties
    const requesterDuty = await examDutyRepository.findById(
      swapRequest.requesterDutyId,
    );

    const receiverDuty = await examDutyRepository.findById(
      swapRequest.receiverDutyId,
    );

    if (!requesterDuty || !receiverDuty) {
      throw new ApiError(404, "Exam duty not found");
    }

    // 5. Duties must still be assigned
    if (
      requesterDuty.status !== DutyStatus.ASSIGNED ||
      receiverDuty.status !== DutyStatus.ASSIGNED
    ) {
      throw new ApiError(400, "Only assigned duties can be swapped.");
    }

    // 6. Check if receiver already has a duty for requester's exam
    const receiverExistingDuty = await examDutyRepository.findByEmployeeAndExam(
      swapRequest.receiverId,
      requesterDuty.examId,
    );

    if (receiverExistingDuty && receiverExistingDuty.id !== requesterDuty.id) {
      throw new ApiError(
        400,
        "Swap cannot be approved because the receiver already has a duty for this examination.",
      );
    }

    // 7. Check if requester already has a duty for receiver's exam
    const requesterExistingDuty =
      await examDutyRepository.findByEmployeeAndExam(
        swapRequest.requesterId,
        receiverDuty.examId,
      );

    if (requesterExistingDuty && requesterExistingDuty.id !== receiverDuty.id) {
      throw new ApiError(
        400,
        "Swap cannot be approved because the requester already has a duty for this examination.",
      );
    }

    // 6. Perform transaction
    const updatedSwapRequest = await prisma.$transaction(async (tx) => {
      await tx.examDuty.update({
        where: { id: requesterDuty.id },
        data: {
          employeeId: null,
        },
      });

      // Step 2: Move receiver duty to requester
      await tx.examDuty.update({
        where: { id: receiverDuty.id },
        data: {
          employeeId: swapRequest.requesterId,
        },
      });

      // Step 3: Move requester duty to receiver
      await tx.examDuty.update({
        where: { id: requesterDuty.id },
        data: {
          employeeId: swapRequest.receiverId,
        },
      });

      // Update swap request
      return await tx.swapRequest.update({
        where: {
          id,
        },
        data: {
          status: SwapStatus.APPROVED,
          approvedById,
          approvedAt: new Date(),
          approvalRemark: data.approvalRemark,
        },
        select: swapRequestSelect,
      });
    });

    // 7. Activity log
    await activityLogService.log({
      employeeId: approvedById,

      action: ActivityAction.APPROVE_SWAP_REQUEST,

      description: `${approver.name} approved the swap request between ${swapRequest.requester.name} and ${swapRequest.receiver.name}.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    // 8. Notify requester
    await notificationService.create({
      employeeId: swapRequest.requesterId,

      title: "Swap Request Approved",

      message: "Your swap request has been approved by the COE.",
    });

    // 9. Notify receiver
    await notificationService.create({
      employeeId: swapRequest.receiverId,

      title: "Swap Request Approved",

      message: "Your accepted swap request has been approved by the COE.",
    });

    // 10. Return response
    return updatedSwapRequest;
  }

  /**
   * Receiver rejects swap request
   */
  async rejectSwap(
    id: string,
    receiverId: string,
    data: RejectSwapRequestDto,
  ): Promise<SwapRequestResponse> {
    // 1. Find swap request
    const swapRequest = await swapRequestRepository.findById(id);

    if (!swapRequest) {
      throw new ApiError(404, "Swap request not found");
    }

    // 2. Verify receiver
    if (swapRequest.receiverId !== receiverId) {
      throw new ApiError(
        403,
        "Only the receiver can reject this swap request.",
      );
    }

    // 3. Only pending requests can be rejected
    if (swapRequest.status !== SwapStatus.PENDING) {
      throw new ApiError(400, "Only pending swap requests can be rejected.");
    }

    // 4. Update request
    const updatedSwapRequest = await swapRequestRepository.update(id, {
      status: SwapStatus.REJECTED,
      reason: data.reason ?? swapRequest.reason,
    });

    // 5. Activity Log
    await activityLogService.log({
      employeeId: receiverId,

      action: ActivityAction.REJECT_SWAP_REQUEST_BY_RECEIVER,

      description: `${updatedSwapRequest.receiver.name} rejected the swap request from ${updatedSwapRequest.requester.name}.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    // 6. Notify requester
    await notificationService.create({
      employeeId: updatedSwapRequest.requesterId,

      title: "Swap Request Rejected",

      message: `${updatedSwapRequest.receiver.name} rejected your swap request.`,
    });

    return updatedSwapRequest;
  }

  /**
   * Requester cancels swap request
   */
  async cancelSwap(
    id: string,
    requesterId: string,
    data: CancelSwapRequestDto,
  ): Promise<SwapRequestResponse> {
    // 1. Find swap request
    const swapRequest = await swapRequestRepository.findById(id);

    if (!swapRequest) {
      throw new ApiError(404, "Swap request not found");
    }

    // 2. Only requester can cancel
    if (swapRequest.requesterId !== requesterId) {
      throw new ApiError(
        403,
        "Only the requester can cancel this swap request.",
      );
    }

    // 3. Only pending requests can be cancelled
    if (swapRequest.status !== SwapStatus.PENDING) {
      throw new ApiError(400, "Only pending swap requests can be cancelled.");
    }

    // 4. Update request
    const updatedSwapRequest = await swapRequestRepository.update(id, {
      status: SwapStatus.CANCELLED,
      reason: data.reason ?? swapRequest.reason,
    });

    // 5. Activity Log
    await activityLogService.log({
      employeeId: requesterId,

      action: ActivityAction.CANCEL_SWAP_REQUEST,

      description: `${updatedSwapRequest.requester.name} cancelled the swap request sent to ${updatedSwapRequest.receiver.name}.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    // 6. Notify receiver
    await notificationService.create({
      employeeId: updatedSwapRequest.receiverId,

      title: "Swap Request Cancelled",

      message: `${updatedSwapRequest.requester.name} cancelled the swap request.`,
    });

    return updatedSwapRequest;
  }
}

export default new SwapRequestService();
