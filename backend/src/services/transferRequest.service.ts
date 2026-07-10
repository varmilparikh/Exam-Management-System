import transferRequestRepository from "../repositories/transferRequest.repository.js";
import employeeRepository from "../repositories/employee.repository.js";
import examDutyRepository from "../repositories/examDuty.repository.js";
import activityLogService from "./activityLog.service.js";
import notificationService from "./notification.service.js";

import { ApiError } from "../utils/apiError.js";

import prisma from "../config/prisma.js";

import type {
  CreateTransferRequestDto,
  ApproveTransferRequestDto,
  RejectTransferRequestDto,
  CancelTransferRequestDto,
} from "../types/transferRequest.types.js";

import {
  transferRequestSelect,
  type TransferRequestResponse,
} from "../constants/prismaSelect.js";

import {
  ActivityAction,
  EntityType,
  TransferStatus,
  DutyStatus,
} from "../generated/prisma/client.js";

class TransferRequestService {
  /**
   * Faculty requests transfer
   */
  async requestTransfer(
    employeeId: string,
    data: CreateTransferRequestDto,
  ): Promise<TransferRequestResponse> {
    const examDuty = await examDutyRepository.findById(data.examDutyId);

    if (!examDuty) {
      throw new ApiError(404, "Exam duty not found");
    }

    if (examDuty.employeeId !== employeeId) {
      throw new ApiError(
        403,
        "You can only request transfer for your own exam duty",
      );
    }

    if (examDuty.status !== "ASSIGNED") {
      throw new ApiError(
        400,
        "Transfer request can only be made for exam duties that are assigned",
      );
    }

    const existingRequest =
      await transferRequestRepository.findPendingByExamDuty(data.examDutyId);

    if (existingRequest) {
      throw new ApiError(
        409,
        "A pending transfer request already exists for this exam duty",
      );
    }

    if (data.toEmployeeId) {
      const replacementEmployee = await employeeRepository.findById(
        data.toEmployeeId,
      );

      if (!replacementEmployee) {
        throw new ApiError(404, "Replacement employee not found");
      }

      if (!replacementEmployee.isActive) {
        throw new ApiError(400, "Replacement employee is inactive");
      }

      if (replacementEmployee.id === employeeId) {
        throw new ApiError(
          400,
          "Replacement employee cannot be the same as the requester",
        );
      }
    }

    const transferRequest = await transferRequestRepository.create({
      status: TransferStatus.PENDING,

      reason: data.reason,

      fromEmployee: {
        connect: {
          id: employeeId,
        },
      },

      examDuty: {
        connect: {
          id: data.examDutyId,
        },
      },

      ...(data.toEmployeeId && {
        toEmployee: {
          connect: {
            id: data.toEmployeeId,
          },
        },
      }),
    });

    await activityLogService.log({
      employeeId: employeeId,

      action: ActivityAction.CREATE_TRANSFER_REQUEST,

      description: "Transfer request created",

      entityType: EntityType.TRANSFER_REQUEST,

      entityId: transferRequest.id,
    });

    // Notification integration will be added next
    // await notificationService.create(...);

    return transferRequest;
  }

  /**
   * Get all transfer requests
   */
  async getAll(): Promise<TransferRequestResponse[]> {
    return transferRequestRepository.findAll();
  }

  /**
   * Get transfer request by ID
   */
  async getById(id: string): Promise<TransferRequestResponse> {
    const transferRequest = await transferRequestRepository.findById(id);

    if (!transferRequest) {
      throw new ApiError(404, "Transfer request not found");
    }

    return transferRequest;
  }

  /**
   * Get pending transfer requests
   */
  async getPending(): Promise<TransferRequestResponse[]> {
    return transferRequestRepository.findPending();
  }

  /**
   * Get transfer requests created by an employee
   */
  async getMyRequests(employeeId: string): Promise<TransferRequestResponse[]> {
    return transferRequestRepository.findByFromEmployee(employeeId);
  }

  /**
   * Approve Transfer Request
   */
  async approveTransfer(
    id: string,
    data: ApproveTransferRequestDto,
  ): Promise<TransferRequestResponse> {
    const transferRequest = await transferRequestRepository.findById(id);

    if (!transferRequest) {
      throw new ApiError(404, "Transfer request not found");
    }

    if (transferRequest.status !== TransferStatus.PENDING) {
      throw new ApiError(
        409,
        `Transfer request is already ${transferRequest.status.toLowerCase()}.`,
      );
    }

    const replacementEmployeeId =
      transferRequest.toEmployeeId ?? data.toEmployeeId;

    if (!replacementEmployeeId) {
      throw new ApiError(400, "Replacement employee is required");
    }

    const replacementEmployee = await employeeRepository.findById(
      replacementEmployeeId,
    );

    if (!replacementEmployee) {
      throw new ApiError(404, "Replacement employee not found");
    }

    if (!replacementEmployee.isActive) {
      throw new ApiError(400, "Replacement employee is inactive");
    }

    if (replacementEmployee.id === transferRequest.fromEmployeeId) {
      throw new ApiError(400, "Replacement employee cannot be the requester");
    }

    const dutyStatus = transferRequest.examDuty.status;

    if (dutyStatus !== DutyStatus.ASSIGNED) {
      throw new ApiError(400, "Only assigned duties can be transferred.");
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update Transfer Request
      await tx.transferRequest.update({
        where: {
          id: transferRequest.id,
        },
        data: {
          status: TransferStatus.APPROVED,
          approvedBy: {
            connect: {
              id: data.approvedById,
            },
          },
          approvedAt: new Date(),
          approvalRemark: data.approvalRemark,
          toEmployee: {
            connect: {
              id: replacementEmployeeId,
            },
          },
        },
      });

      // 2. Reassign Exam Duty
      await tx.examDuty.update({
        where: {
          id: transferRequest.examDutyId,
        },
        data: {
          employee: {
            connect: {
              id: replacementEmployeeId,
            },
          },
        },
      });
      // 3. Activity Log
      await tx.activityLog.create({
        data: {
          employee: {
            connect: {
              id: data.approvedById,
            },
          },
          action: ActivityAction.APPROVE_TRANSFER_REQUEST,
          description: `Transfer request approved`,
          entityType: EntityType.TRANSFER_REQUEST,
          entityId: transferRequest.id,
        },
      });

      // 4. Notify Requester
      await tx.notification.create({
        data: {
          employee: {
            connect: {
              id: transferRequest.fromEmployeeId,
            },
          },
          title: "Transfer Request Approved",
          message: "Your transfer request has been approved.",
        },
      });

      // 5. Notify Replacement Faculty
      await tx.notification.create({
        data: {
          employee: {
            connect: {
              id: replacementEmployeeId,
            },
          },
          title: "New Examination Duty",
          message: "A new examination duty has been assigned to you.",
        },
      });

      // 6. Return Updated Transfer Request
      const updatedTransferRequest = await tx.transferRequest.findUniqueOrThrow(
        {
          where: {
            id: transferRequest.id,
          },
          select: transferRequestSelect,
        },
      );

      return updatedTransferRequest;
    });
  }

  /**
   * Reject Transfer Request
   */
  async rejectTransfer(
    id: string,
    data: RejectTransferRequestDto,
  ): Promise<TransferRequestResponse> {
    const transferRequest = await transferRequestRepository.findById(id);

    if (!transferRequest) {
      throw new ApiError(404, "Transfer request not found");
    }

    if (transferRequest.status !== TransferStatus.PENDING) {
      throw new ApiError(
        409,
        `Transfer request is already ${transferRequest.status.toLowerCase()}.`,
      );
    }

    const approver = await employeeRepository.findById(data.approvedById);

    if (!approver) {
      throw new ApiError(404, "Approver not found");
    }

    return prisma.$transaction(async (tx) => {
      await tx.transferRequest.update({
        where: {
          id,
        },
        data: {
          status: TransferStatus.REJECTED,
          approvedAt: new Date(),
          approvalRemark: data.approvalRemark,
          approvedBy: {
            connect: {
              id: data.approvedById,
            },
          },
        },
      });

      await tx.activityLog.create({
        data: {
          employee: {
            connect: {
              id: data.approvedById,
            },
          },
          action: ActivityAction.REJECT_TRANSFER_REQUEST,
          description: `${approver.name} rejected transfer request of ${transferRequest.fromEmployee.name}.`,
          entityType: EntityType.TRANSFER_REQUEST,
          entityId: transferRequest.id,
        },
      });

      await tx.notification.create({
        data: {
          employee: {
            connect: {
              id: transferRequest.fromEmployeeId,
            },
          },
          title: "Transfer Request Rejected",
          message: `Your transfer request for ${transferRequest.examDuty.exam.examName} has been rejected.`,
        },
      });

      return tx.transferRequest.findUniqueOrThrow({
        where: {
          id,
        },
        select: transferRequestSelect,
      });
    });
  }

  /**
   * Cancel Transfer Request
   */
  async cancelTransfer(
    id: string,
    employeeId: string,
    data: CancelTransferRequestDto,
  ): Promise<TransferRequestResponse> {
    const transferRequest = await transferRequestRepository.findById(id);

    if (!transferRequest) {
      throw new ApiError(404, "Transfer request not found");
    }

    if (transferRequest.status !== TransferStatus.PENDING) {
      throw new ApiError(
        409,
        `Transfer request is already ${transferRequest.status.toLowerCase()}.`,
      );
    }

    if (transferRequest.fromEmployeeId !== employeeId) {
      throw new ApiError(403, "You can only cancel your own transfer request.");
    }

    const cancelledRequest = await transferRequestRepository.update(id, {
      status: TransferStatus.CANCELLED,
      reason: data.reason ?? transferRequest.reason,
    });

    await activityLogService.log({
      employeeId,

      action: ActivityAction.CANCEL_TRANSFER_REQUEST,

      description: `${transferRequest.fromEmployee.name} cancelled the transfer request.`,

      entityType: EntityType.TRANSFER_REQUEST,

      entityId: transferRequest.id,
    });

    return cancelledRequest;
  }
}

export default new TransferRequestService();
