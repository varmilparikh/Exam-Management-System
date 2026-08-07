import swapRequestRepository from "../repositories/swapRequest.repository.js";
import employeeRepository from "../repositories/employee.repository.js";
import examDutyRepository from "../repositories/examDuty.repository.js";
import activityLogService from "./activityLog.service.js";
import employeeValidationService from "./employeeValidation.service.js";
import notificationHelperService from "./notificationHelper.service.js";

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
  RejectSwapByCoeDto,
} from "../types/swapRequest.types.js";

import {
  type SwapRequestResponse,
  type ExamDutyResponse,
} from "../constants/prismaSelect.js";
import type { SwapRequestFilters } from "../types/swapRequestFilter.types.js";

class SwapRequestService {
  private ensurePending(request: SwapRequestResponse): void {
    if (request.status !== SwapStatus.PENDING) {
      throw new ApiError(409, `Swap request is already ${request.status}.`);
    }
  }

  private ensureAccepted(request: SwapRequestResponse): void {
    if (request.status !== SwapStatus.ACCEPTED) {
      throw new ApiError(
        409,
        `Swap request is ${request.status}, not ACCEPTED.`,
      );
    }
  }

  private ensureAssigned(...duties: ExamDutyResponse[]): void {
    for (const duty of duties) {
      if (duty.status !== DutyStatus.ASSIGNED) {
        throw new ApiError(400, "Only assigned duties can be swapped.");
      }
    }
  }

  private ensureUpcoming(...duties: ExamDutyResponse[]): void {
    for (const duty of duties) {
      if (duty.exam.status !== ExamStatus.UPCOMING) {
        throw new ApiError(400, "Only upcoming examinations can be swapped.");
      }
    }
  }

  private async getSwapRequestOrThrow(
    id: string,
  ): Promise<SwapRequestResponse> {
    const request = await swapRequestRepository.findById(id);

    if (!request) {
      throw new ApiError(404, "Swap request not found");
    }

    return request;
  }

  /**
   * Get Swap Requests
   */
  async getRequests(
    user: {
      id: string;
      role: Role;
    },
    page: number,
    limit: number,
    filters: SwapRequestFilters,
  ): Promise<SwapRequestResponse[]> {
    switch (user.role) {
      case Role.SUPER_ADMIN:
        return swapRequestRepository.findAll(page, limit, filters);

      case Role.COE: {
        return swapRequestRepository.findAll(page, limit, {
          ...filters,
          status: SwapStatus.ACCEPTED,
        });
      }

      case Role.FACULTY: {
        return swapRequestRepository.findForFaculty(
          user.id,
          page,
          limit,
          filters,
        );
      }

      default:
        return [];
    }
  }

  /**
   * Faculty requests a duty swap
   */
  async requestSwap(
    requesterId: string,
    data: CreateSwapRequestDto,
  ): Promise<SwapRequestResponse> {
    const requester = await employeeValidationService.validateEmployee(
      requesterId,
      "Requester",
    );

    const receiver = await employeeValidationService.validateEmployee(
      data.receiverId,
      "Receiver",
    );

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

    this.ensureAssigned(requesterDuty, receiverDuty);
    this.ensureUpcoming(requesterDuty, receiverDuty);

    if (requesterDuty.id === receiverDuty.id) {
      throw new ApiError(400, "Cannot swap the same duty.");
    }

    if (requesterDuty.employeeId === receiverDuty.employeeId) {
      throw new ApiError(
        400,
        "Both duties already belong to the same faculty.",
      );
    }

    const existingRequest = await swapRequestRepository.findPendingByDuties(
      data.requesterDutyId,
      data.receiverDutyId,
    );

    if (existingRequest) {
      throw new ApiError(409, "A pending swap request already exists.");
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

      description: `${requester.name} requested to swap duties with ${receiver.name}. (${requesterDuty.exam.examName} ↔ ${receiverDuty.exam.examName})`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: swapRequest.id,
    });

    await notificationHelperService.notify(
      receiver.id,
      "Swap Request Received",
      `${requester.name} has requested to swap examination duties with you.`,
    );

    return swapRequest;
  }

  /**
   * Receiver accepts swap request
   */
  async acceptSwap(
    id: string,
    receiverId: string,
  ): Promise<SwapRequestResponse> {
    const swapRequest = await this.getSwapRequestOrThrow(id);

    if (swapRequest.receiverId !== receiverId) {
      throw new ApiError(
        403,
        "Only the receiver can accept this swap request.",
      );
    }

    this.ensurePending(swapRequest);

    const updatedSwapRequest = await swapRequestRepository.update(id, {
      status: SwapStatus.ACCEPTED,
    });

    await activityLogService.log({
      employeeId: receiverId,

      action: ActivityAction.ACCEPT_SWAP_REQUEST,

      description: `${updatedSwapRequest.receiver.name} accepted ${updatedSwapRequest.requester.name}'s swap request.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    const coes = await employeeRepository.findByRole(Role.COE);

    await notificationHelperService.notifyMany(
      coes.map((coe) => coe.id),
      "Swap Request Awaiting Approval",
      `${updatedSwapRequest.requester.name} and ${updatedSwapRequest.receiver.name} have agreed to swap examination duties. Approval is required.`,
    );

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
    const approver = await employeeValidationService.validateEmployee(
      approvedById,
      "Approver",
    );

    // 2. Find swap request
    const swapRequest = await this.getSwapRequestOrThrow(id);

    // 3. Request must be accepted
    this.ensureAccepted(swapRequest);

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
    this.ensureAssigned(requesterDuty, receiverDuty);

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

    this.ensureUpcoming(requesterDuty, receiverDuty);

    // 6. Perform transaction
    const updatedSwapRequest =
      await swapRequestRepository.approveSwapTransaction({
        id,
        approvedById,
        approvalRemark: data.approvalRemark ?? null,
        requesterDutyId: requesterDuty.id,
        receiverDutyId: receiverDuty.id,
        requesterId: swapRequest.requesterId,
        receiverId: swapRequest.receiverId,
      });

    // 7. Activity log
    await activityLogService.log({
      employeeId: approvedById,

      action: ActivityAction.APPROVE_SWAP_REQUEST,

      description:
        `${approver.name} approved the duty swap between ` +
        `${swapRequest.requester.name} and ${swapRequest.receiver.name}.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    // 8. Notify requester
    await notificationHelperService.notifySwapApproved(
      swapRequest.requesterId,
      swapRequest.receiverId,
    );

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
    const swapRequest = await this.getSwapRequestOrThrow(id);

    // 2. Verify receiver
    if (swapRequest.receiverId !== receiverId) {
      throw new ApiError(
        403,
        "Only the receiver can reject this swap request.",
      );
    }

    // 3. Only pending requests can be rejected
    this.ensurePending(swapRequest);

    // 4. Update request
    const updatedSwapRequest = await swapRequestRepository.update(id, {
      status: SwapStatus.REJECTED,
      reason: data.reason,
    });

    // 5. Activity Log
    await activityLogService.log({
      employeeId: receiverId,

      action: ActivityAction.REJECT_SWAP_REQUEST_BY_RECEIVER,

      description:
        `${updatedSwapRequest.receiver.name} rejected ` +
        `${updatedSwapRequest.requester.name}'s swap request.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    // 6. Notify requester
    await notificationHelperService.notify(
      updatedSwapRequest.requesterId,
      "Swap Request Rejected",
      `${updatedSwapRequest.receiver.name} rejected your swap request.`,
    );
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
    const swapRequest = await this.getSwapRequestOrThrow(id);

    // 2. Only requester can cancel
    if (swapRequest.requesterId !== requesterId) {
      throw new ApiError(
        403,
        "Only the requester can cancel this swap request.",
      );
    }

    // 3. Only pending requests can be cancelled
    this.ensurePending(swapRequest);

    // 4. Update request
    const updatedSwapRequest = await swapRequestRepository.update(id, {
      status: SwapStatus.CANCELLED,
      reason: data.reason ?? swapRequest.reason,
    });

    // 5. Activity Log
    await activityLogService.log({
      employeeId: requesterId,

      action: ActivityAction.CANCEL_SWAP_REQUEST,

      description:
        `${updatedSwapRequest.requester.name} cancelled the swap request sent to ` +
        `${updatedSwapRequest.receiver.name}.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    // 6. Notify receiver
    await notificationHelperService.notify(
      updatedSwapRequest.receiverId,
      "Swap Request Cancelled",
      `${updatedSwapRequest.requester.name} cancelled the swap request.`,
    );

    return updatedSwapRequest;
  }

  /**
   * COE rejects an accepted swap request
   */
  async rejectSwapByCoe(
    id: string,
    approvedById: string,
    data: RejectSwapByCoeDto,
  ): Promise<SwapRequestResponse> {
    // 1. Find approver
    const approver = await employeeValidationService.validateEmployee(
      approvedById,
      "Approver",
    );

    // 2. Find swap request
    const swapRequest = await this.getSwapRequestOrThrow(id);

    // 3. Must already be accepted
    this.ensureAccepted(swapRequest);

    // 4. Reject request
    const updatedSwapRequest = await swapRequestRepository.update(id, {
      status: SwapStatus.REJECTED,

      approvedBy: {
        connect: {
          id: approvedById,
        },
      },

      approvedAt: new Date(),

      approvalRemark: data.approvalRemark,
    });

    // 5. Activity Log
    await activityLogService.log({
      employeeId: approvedById,

      action: ActivityAction.REJECT_SWAP_REQUEST_BY_COE,

      description:
        `${approver.name} rejected the swap request between ` +
        `${updatedSwapRequest.requester.name} and ` +
        `${updatedSwapRequest.receiver.name}.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    // 6. Notify requester
    await notificationHelperService.notify(
      updatedSwapRequest.requesterId,
      "Swap Request Rejected",
      "Your accepted swap request has been rejected by the COE.",
    );

    // 7. Notify receiver
    await notificationHelperService.notify(
      updatedSwapRequest.receiverId,
      "Swap Request Rejected",
      "The swap request you accepted has been rejected by the COE.",
    );

    return updatedSwapRequest;
  }
}

export default new SwapRequestService();
