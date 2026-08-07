import {
  transferRequestSelect,
  type TransferRequestResponse,
  type ExamDutyResponse,
} from "../constants/prismaSelect.js";

import type { TransferRequestFilters } from "../types/transferRequestFilter.types.js";

import {
  TransferStatus,
  DutyStatus,
  ActivityAction,
  EntityType,
  ExamStatus,
  Role,
} from "../generated/prisma/client.js";
import transferRequestRepository from "../repositories/transferRequest.repository.js";
import examDutyRepository from "../repositories/examDuty.repository.js";
import employeeValidationService from "./employeeValidation.service.js";
import activityLogService from "./activityLog.service.js";
import notificationHelperService from "./notificationHelper.service.js";

import { ApiError } from "../utils/apiError.js";

import type {
  CreateTransferRequestDto,
  ApproveTransferRequestDto,
  RejectTransferRequestDto,
  CancelTransferRequestDto,
} from "../types/transferRequest.types.js";

class TransferRequestService {
  private async getTransferRequestOrThrow(
    id: string,
  ): Promise<TransferRequestResponse> {
    const request = await transferRequestRepository.findById(id);

    if (!request) {
      throw new ApiError(404, "Transfer request not found.");
    }

    return request;
  }

  private async getExamDutyOrThrow(id: string): Promise<ExamDutyResponse> {
    const duty = await examDutyRepository.findById(id);

    if (!duty) {
      throw new ApiError(404, "Exam duty not found.");
    }

    return duty;
  }

  private ensurePending(request: TransferRequestResponse): void {
    if (request.status !== TransferStatus.PENDING) {
      throw new ApiError(409, `Transfer request is already ${request.status}.`);
    }
  }

  private ensureAssigned(duty: { status: DutyStatus }): void {
    if (duty.status !== DutyStatus.ASSIGNED) {
      throw new ApiError(400, "Only assigned duties can be transferred.");
    }
  }

  private ensureUpcoming(duty: {
    exam: {
      status: ExamStatus;
    };
  }): void {
    if (duty.exam.status !== ExamStatus.UPCOMING) {
      throw new ApiError(400, "Only upcoming examinations can be transferred.");
    }
  }

  private ensureOwnership(duty: ExamDutyResponse, employeeId: string): void {
    if (duty.employeeId !== employeeId) {
      throw new ApiError(
        403,
        "You can only request transfer for your own examination duty.",
      );
    }
  }

  /**
   * Faculty requests transfer
   */
  async requestTransfer(
    employeeId: string,
    data: CreateTransferRequestDto,
  ): Promise<TransferRequestResponse> {
    const examDuty = await this.getExamDutyOrThrow(data.examDutyId);

    this.ensureOwnership(examDuty, employeeId);

    this.ensureAssigned(examDuty);

    this.ensureUpcoming(examDuty);

    const existing = await transferRequestRepository.findPendingByExamDuty(
      data.examDutyId,
    );

    if (existing) {
      throw new ApiError(409, "A pending transfer request already exists.");
    }

    if (data.toEmployeeId) {
      await employeeValidationService.validateFaculty(data.toEmployeeId);
    }

    const transfer = await transferRequestRepository.create({
      status: TransferStatus.PENDING,

      reason: data.reason,

      fromEmployee: {
        connect: {
          id: employeeId,
        },
      },

      examDuty: {
        connect: {
          id: examDuty.id,
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

    const requester = await employeeValidationService.validateEmployee(
      employeeId,
      "Employee",
    );

    if (!requester) {
      throw new ApiError(404, "Employee not found.");
    }

    await activityLogService.log({
      employeeId,

      action: ActivityAction.CREATE_TRANSFER_REQUEST,

      description: `${requester.name} requested a transfer for "${examDuty.exam.examName}".`,

      entityType: EntityType.TRANSFER_REQUEST,

      entityId: transfer.id,
    });

    if (data.toEmployeeId) {
      await notificationHelperService.notify(
        data.toEmployeeId,
        "Transfer Request Received",
        `${requester.name} has requested to transfer an examination duty to you.`,
      );
    }

    return transfer;
  }

  /**
   * Get all transfer requests
   */
  async getAll(
    filters: TransferRequestFilters,
  ): Promise<TransferRequestResponse[]> {
    return transferRequestRepository.findAll(filters);
  }

  async getRequests(
    user: {
      id: string;
      role: Role;
    },
    filters: TransferRequestFilters,
  ): Promise<TransferRequestResponse[]> {
    switch (user.role) {
      case Role.SUPER_ADMIN:
      case Role.COE:
        return transferRequestRepository.findAll(filters);

      case Role.FACULTY:
        return transferRequestRepository.findForFaculty(user.id, filters);

      default:
        return [];
    }
  }

  /**
   * Get transfer request by ID
   */
  async getById(
    id: string,
    userId: string,
    role: Role,
  ): Promise<TransferRequestResponse> {
    const request = await this.getTransferRequestOrThrow(id);

    const isOwner = request.fromEmployeeId === userId;

    const isReplacement = request.toEmployeeId === userId;

    const isAdmin = role === Role.COE || role === Role.SUPER_ADMIN;

    if (!isOwner && !isReplacement && !isAdmin) {
      throw new ApiError(
        403,
        "You are not authorized to view this transfer request.",
      );
    }

    return request;
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
    return transferRequestRepository.findForFaculty(employeeId, {});
  }

  /**
   * Approve Transfer Request
   */

  async approveTransfer(
    id: string,
    approvedById: string,
    data: ApproveTransferRequestDto,
  ): Promise<TransferRequestResponse> {
    const approver = await employeeValidationService.validateEmployee(
      approvedById,
      "Approver",
    );

    const transferRequest = await this.getTransferRequestOrThrow(id);

    this.ensurePending(transferRequest);

    this.ensureAssigned(transferRequest.examDuty);

    this.ensureUpcoming(transferRequest.examDuty);

    const replacementEmployeeId =
      transferRequest.toEmployeeId ?? data.toEmployeeId;

    if (!replacementEmployeeId) {
      throw new ApiError(400, "Replacement employee is required.");
    }

    const replacementEmployee = await employeeValidationService.validateFaculty(
      replacementEmployeeId,
      "Replacement employee",
    );

    const existingDuty = await examDutyRepository.findByEmployeeAndExam(
      replacementEmployee.id,
      transferRequest.examDuty.exam.id,
    );

    if (existingDuty && existingDuty.id !== transferRequest.examDutyId) {
      throw new ApiError(
        409,
        "Replacement employee already has a duty for this examination.",
      );
    }

    const updatedTransfer =
      await transferRequestRepository.approveTransferTransaction({
        id,
        approvedById,
        replacementEmployeeId: replacementEmployee.id,
        examDutyId: transferRequest.examDutyId,
        approvalRemark: data.approvalRemark ?? null,
      });

    await activityLogService.log({
      employeeId: approvedById,

      action: ActivityAction.APPROVE_TRANSFER_REQUEST,

      description: `${approver.name} approved ${transferRequest.fromEmployee.name}'s transfer request for "${transferRequest.examDuty.exam.examName}".`,

      entityType: EntityType.TRANSFER_REQUEST,

      entityId: updatedTransfer.id,
    });

    await notificationHelperService.notify(
      transferRequest.fromEmployeeId,
      "Transfer Request Approved",
      "Your transfer request has been approved.",
    );

    await notificationHelperService.notify(
      replacementEmployee.id,
      "New Examination Duty",
      `You have been assigned "${transferRequest.examDuty.exam.examName}".`,
    );

    return updatedTransfer;
  }

  /**
   * Reject Transfer Request
   */

  async rejectTransfer(
    id: string,
    approvedById: string,
    data: RejectTransferRequestDto,
  ): Promise<TransferRequestResponse> {
    const approver = await employeeValidationService.validateEmployee(
      approvedById,
      "Approver",
    );

    const transferRequest = await this.getTransferRequestOrThrow(id);

    this.ensurePending(transferRequest);

    const updatedTransfer =
      await transferRequestRepository.rejectTransferTransaction({
        id,
        approvedById,
        approvalRemark: data.approvalRemark ?? null,
      });

    await activityLogService.log({
      employeeId: approvedById,

      action: ActivityAction.REJECT_TRANSFER_REQUEST,

      description: `${approver.name} rejected ${transferRequest.fromEmployee.name}'s transfer request.`,

      entityType: EntityType.TRANSFER_REQUEST,

      entityId: updatedTransfer.id,
    });

    await notificationHelperService.notify(
      transferRequest.fromEmployeeId,
      "Transfer Request Rejected",
      `Your transfer request for "${transferRequest.examDuty.exam.examName}" has been rejected.`,
    );

    return updatedTransfer;
  }

  /**
   * Cancel Transfer Request
   */
  async cancelTransfer(
    id: string,
    employeeId: string,
    data: CancelTransferRequestDto,
  ): Promise<TransferRequestResponse> {
    const transferRequest = await this.getTransferRequestOrThrow(id);

    this.ensurePending(transferRequest);

    if (transferRequest.fromEmployeeId !== employeeId) {
      throw new ApiError(403, "You can only cancel your own transfer request.");
    }

    const cancelled = await transferRequestRepository.update(id, {
      status: TransferStatus.CANCELLED,
      reason: data.reason ?? transferRequest.reason,
    });

    await activityLogService.log({
      employeeId,

      action: ActivityAction.CANCEL_TRANSFER_REQUEST,

      description: `${transferRequest.fromEmployee.name} cancelled the transfer request for "${transferRequest.examDuty.exam.examName}".`,

      entityType: EntityType.TRANSFER_REQUEST,

      entityId: cancelled.id,
    });

    if (transferRequest.toEmployeeId) {
      await notificationHelperService.notify(
        transferRequest.toEmployeeId,
        "Transfer Request Cancelled",
        `${transferRequest.fromEmployee.name} cancelled the transfer request.`,
      );
    }

    return cancelled;
  }
}

export default new TransferRequestService();
