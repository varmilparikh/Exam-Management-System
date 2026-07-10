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

import type { CreateSwapRequestDto } from "../types/swapRequest.types.js";

import type { SwapRequestResponse } from "../constants/prismaSelect.js";

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
}

export default new SwapRequestService();
