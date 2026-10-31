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
  RejectSwapRequestDto,
  CancelSwapRequestDto,
} from "../types/swapRequest.types.js";

import {
  type SwapRequestResponse,
  type ExamDutyResponse,
} from "../constants/prismaSelect.js";
import type { SwapRequestFilters } from "../types/swapRequestFilter.types.js";

class SwapRequestService {
  private async notifyAuthorities(title: string, message: string) {
    const [admins, coes] = await Promise.all([
      employeeRepository.findByRole(Role.SUPER_ADMIN),
      employeeRepository.findByRole(Role.COE),
    ]);
    await notificationHelperService.notifyMany(
      [...new Set([...admins, ...coes].map((employee) => employee.id))],
      title,
      message,
    );
  }

  private ensurePending(request: SwapRequestResponse): void {
    if (request.status !== SwapStatus.PENDING) {
      throw new ApiError(409, `Swap request is already ${request.status}.`);
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

      case Role.COE:
        return swapRequestRepository.findAll(page, limit, filters);

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
    await this.notifyAuthorities(
      "Swap Request Received",
      `${requester.name} requested to exchange "${requesterDuty.exam.examName}" with ${receiver.name}'s "${receiverDuty.exam.examName}" duty. The system will complete the exchange after the receiver accepts.`,
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

    if (swapRequest.status !== SwapStatus.PENDING && swapRequest.status !== SwapStatus.ACCEPTED) {
      throw new ApiError(409, `Swap request is already ${swapRequest.status}.`);
    }

    const updatedSwapRequest = await swapRequestRepository.completeAcceptedSwapTransaction(id, receiverId);

    await activityLogService.log({
      employeeId: receiverId,

      action: ActivityAction.ACCEPT_SWAP_REQUEST,

      description: `${updatedSwapRequest.receiver.name} accepted ${updatedSwapRequest.requester.name}'s swap. "${updatedSwapRequest.requesterDuty.exam.examName}" and "${updatedSwapRequest.receiverDuty.exam.examName}" duties were exchanged.`,

      entityType: EntityType.SWAP_REQUEST,

      entityId: updatedSwapRequest.id,
    });

    await activityLogService.log({
      employeeId: receiverId,
      action: ActivityAction.COMPLETE_SWAP_REQUEST,
      description: `The system exchanged "${updatedSwapRequest.requesterDuty.exam.examName}" and "${updatedSwapRequest.receiverDuty.exam.examName}" between ${updatedSwapRequest.requester.name} and ${updatedSwapRequest.receiver.name} after receiver acceptance.`,
      entityType: EntityType.SWAP_REQUEST,
      entityId: updatedSwapRequest.id,
    });
    await Promise.all([
      notificationHelperService.notify(updatedSwapRequest.requesterId, "Swap Completed", `Your swap with ${updatedSwapRequest.receiver.name} is complete. The duties for "${updatedSwapRequest.requesterDuty.exam.examName}" and "${updatedSwapRequest.receiverDuty.exam.examName}" were exchanged.`),
      notificationHelperService.notify(updatedSwapRequest.receiverId, "Swap Completed", `Your swap with ${updatedSwapRequest.requester.name} is complete. The duties for "${updatedSwapRequest.requesterDuty.exam.examName}" and "${updatedSwapRequest.receiverDuty.exam.examName}" were exchanged.`),
      this.notifyAuthorities("Swap Completed", `${updatedSwapRequest.requester.name} and ${updatedSwapRequest.receiver.name} exchanged duties for "${updatedSwapRequest.requesterDuty.exam.examName}" and "${updatedSwapRequest.receiverDuty.exam.examName}".`),
    ]);

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
    await this.notifyAuthorities(
      "Swap Request Rejected",
      `${updatedSwapRequest.receiver.name} rejected ${updatedSwapRequest.requester.name}'s swap request for "${updatedSwapRequest.requesterDuty.exam.examName}" and "${updatedSwapRequest.receiverDuty.exam.examName}".`,
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

    await this.notifyAuthorities(
      "Swap Request Cancelled",
      `${updatedSwapRequest.requester.name} cancelled the swap request to ${updatedSwapRequest.receiver.name} for "${updatedSwapRequest.requesterDuty.exam.examName}" and "${updatedSwapRequest.receiverDuty.exam.examName}".`,
    );

    // 6. Notify receiver
    await notificationHelperService.notify(
      updatedSwapRequest.receiverId,
      "Swap Request Cancelled",
      `${updatedSwapRequest.requester.name} cancelled the swap request.`,
    );

    return updatedSwapRequest;
  }

}

export default new SwapRequestService();
