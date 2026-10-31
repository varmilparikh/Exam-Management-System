import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";
import {
  TransferStatus,
  DutyStatus,
  ExamOptInStatus,
  ExamStatus,
  Role,
} from "../generated/prisma/client.js";

import {
  transferRequestSelect,
  type TransferRequestResponse,
} from "../constants/prismaSelect.js";

import type {
  ApproveTransferTransactionData,
  RejectTransferTransactionData,
} from "../types/transferRequest.types.js";

import type { TransferRequestFilters } from "../types/transferRequestFilter.types.js";
import { ApiError } from "../utils/apiError.js";
import { hasSessionStarted } from "../utils/examSession.utils.js";

class TransferRequestRepository {
  /**
   * Build dynamic filters
   */
  private buildFilters(
    filters: TransferRequestFilters,
  ): Prisma.TransferRequestWhereInput {
    const where: Prisma.TransferRequestWhereInput = {
      isDeleted: false,
    };

    if (filters.status) {
      where.status = filters.status as TransferStatus;
    }

    if (filters.search) {
      where.OR = [
        {
          examDuty: {
            exam: {
              examName: {
                contains: filters.search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          fromEmployee: {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        },
        {
          toEmployee: {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    return where;
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<TransferRequestResponse | null> {
    return prisma.transferRequest.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Find all
   */
  async findAll(
    filters: TransferRequestFilters,
  ): Promise<TransferRequestResponse[]> {
    const where = this.buildFilters(filters);

    return prisma.transferRequest.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: transferRequestSelect,
    });
  }

  async findForDepartment(
    departmentId: string,
    filters: TransferRequestFilters,
  ): Promise<TransferRequestResponse[]> {
    return prisma.transferRequest.findMany({
      where: {
        AND: [
          this.buildFilters(filters),
          { fromEmployee: { departmentId, isDeleted: false } },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: transferRequestSelect,
    });
  }

  async findByIdForDepartment(
    id: string,
    departmentId: string,
  ): Promise<TransferRequestResponse | null> {
    return prisma.transferRequest.findFirst({
      where: {
        id,
        isDeleted: false,
        fromEmployee: { departmentId, isDeleted: false },
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Pending requests
   */
  async findPending(): Promise<TransferRequestResponse[]> {
    return prisma.transferRequest.findMany({
      where: {
        status: TransferStatus.PENDING,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Pending request for a duty
   */
  async findPendingByExamDuty(
    examDutyId: string,
  ): Promise<TransferRequestResponse | null> {
    return prisma.transferRequest.findFirst({
      where: {
        examDutyId,
        status: TransferStatus.PENDING,
        isDeleted: false,
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Requests for a faculty
   * (Created by OR Assigned to)
   */
  async findForFaculty(
    employeeId: string,
    filters: TransferRequestFilters,
  ): Promise<TransferRequestResponse[]> {
    const where: Prisma.TransferRequestWhereInput = {
      ...this.buildFilters(filters),

      AND: [
        {
          OR: [{ fromEmployeeId: employeeId }, { toEmployeeId: employeeId }],
        },
      ],
    };

    return prisma.transferRequest.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: transferRequestSelect,
    });
  }

  async getAll(filters: TransferRequestFilters) {
    return this.findAll(filters);
  }

  /**
   * Find by Exam Duty
   */
  async findByExamDuty(examDutyId: string): Promise<TransferRequestResponse[]> {
    return prisma.transferRequest.findMany({
      where: {
        examDutyId,
        isDeleted: false,
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Create
   */
  async create(
    data: Prisma.TransferRequestCreateInput,
  ): Promise<TransferRequestResponse> {
    return prisma.transferRequest.create({
      data,
      select: transferRequestSelect,
    });
  }

  /**
   * Update
   */
  async update(
    id: string,
    data: Prisma.TransferRequestUpdateInput,
  ): Promise<TransferRequestResponse> {
    return prisma.transferRequest.update({
      where: {
        id,
      },
      data,
      select: transferRequestSelect,
    });
  }

  /**
   * Soft delete
   */
  async softDelete(id: string): Promise<TransferRequestResponse> {
    return prisma.transferRequest.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      select: transferRequestSelect,
    });
  }

  async cancelPending(
    id: string,
    employeeId: string,
    reason: string | null | undefined,
  ): Promise<TransferRequestResponse> {
    const updated = await prisma.transferRequest.updateMany({
      where: {
        id,
        fromEmployeeId: employeeId,
        status: TransferStatus.PENDING,
        isDeleted: false,
      },
      data: {
        status: TransferStatus.CANCELLED,
        reason,
      },
    });

    if (updated.count !== 1) {
      throw new ApiError(
        409,
        "This transfer request has already been processed.",
      );
    }

    return prisma.transferRequest.findUniqueOrThrow({
      where: { id },
      select: transferRequestSelect,
    });
  }

  /**
   * Approve transfer transaction
   *
   * Repository should ONLY perform database operations.
   */
  async approveTransferTransaction({
    id,
    approvedById,
    replacementEmployeeId,
    examDutyId,
    fromEmployeeId,
    approvalRemark,
  }: ApproveTransferTransactionData): Promise<TransferRequestResponse> {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const updatedRequest = await tx.transferRequest.updateMany({
            where: {
              id,
              fromEmployeeId,
              examDutyId,
              status: TransferStatus.PENDING,
              isDeleted: false,
            },
            data: {
              status: TransferStatus.APPROVED,
              approvedById,
              approvedAt: new Date(),
              approvalRemark,
              toEmployeeId: replacementEmployeeId,
            },
          });

          if (updatedRequest.count !== 1) {
            throw new ApiError(
              409,
              "This transfer request has already been processed.",
            );
          }

          const duty = await tx.examDuty.findFirst({
            where: {
              id: examDutyId,
              employeeId: fromEmployeeId,
              status: DutyStatus.ASSIGNED,
              isDeleted: false,
              exam: { isDeleted: false, status: ExamStatus.UPCOMING },
            },
            select: {
              id: true,
              examId: true,
              exam: {
                select: {
                  examDate: true,
                  startTime: true,
                  endTime: true,
                  status: true,
                },
              },
            },
          });

          if (!duty || hasSessionStarted(duty.exam)) {
            throw new ApiError(
              409,
              "The duty is no longer available for transfer.",
            );
          }

          const replacement = await tx.employee.findFirst({
            where: {
              id: replacementEmployeeId,
              role: Role.FACULTY,
              isActive: true,
              isDeleted: false,
            },
            select: { id: true },
          });

          if (!replacement) {
            throw new ApiError(
              409,
              "The replacement faculty member is no longer active.",
            );
          }

          const [overlappingDuty, overlappingOptIn] = await Promise.all([
            tx.examDuty.findFirst({
              where: {
                employeeId: replacementEmployeeId,
                isDeleted: false,
                id: { not: examDutyId },
                exam: {
                  isDeleted: false,
                  status: { in: [ExamStatus.UPCOMING, ExamStatus.ACTIVE] },
                  examDate: duty.exam.examDate,
                  startTime: { lt: duty.exam.endTime },
                  endTime: { gt: duty.exam.startTime },
                },
              },
              select: { id: true },
            }),
            tx.examOptIn.findFirst({
              where: {
                employeeId: replacementEmployeeId,
                status: {
                  in: [ExamOptInStatus.PENDING, ExamOptInStatus.CONFIRMED],
                },
                examId: { not: duty.examId },
                exam: {
                  isDeleted: false,
                  status: ExamStatus.UPCOMING,
                  examDate: duty.exam.examDate,
                  startTime: { lt: duty.exam.endTime },
                  endTime: { gt: duty.exam.startTime },
                },
              },
              select: { id: true },
            }),
          ]);

          if (overlappingDuty || overlappingOptIn) {
            throw new ApiError(
              409,
              "The replacement faculty member has a duty or opt-in during this session.",
            );
          }

          const updatedDuty = await tx.examDuty.updateMany({
            where: {
              id: examDutyId,
              employeeId: fromEmployeeId,
              status: DutyStatus.ASSIGNED,
              isDeleted: false,
            },
            data: {
              employeeId: replacementEmployeeId,
              status: DutyStatus.ASSIGNED,
            },
          });

          if (updatedDuty.count !== 1) {
            throw new ApiError(
              409,
              "The duty changed while the transfer was being approved.",
            );
          }

          return tx.transferRequest.findUniqueOrThrow({
            where: { id },
            select: transferRequestSelect,
          });
        },
        { isolationLevel: "Serializable" },
      );
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2034"
      ) {
        throw new ApiError(
          409,
          "The duty changed during approval. Please retry.",
        );
      }
      throw error;
    }
  }

  /**
   * Reject transfer transaction
   *
   * Repository should ONLY perform database operations.
   */
  async rejectTransferTransaction({
    id,
    approvedById,
    approvalRemark,
  }: RejectTransferTransactionData): Promise<TransferRequestResponse> {
    const updated = await prisma.transferRequest.updateMany({
      where: {
        id,
        status: TransferStatus.PENDING,
        isDeleted: false,
      },
      data: {
        status: TransferStatus.REJECTED,
        approvedById,
        approvedAt: new Date(),
        approvalRemark,
      },
    });

    if (updated.count !== 1) {
      throw new ApiError(
        409,
        "This transfer request has already been processed.",
      );
    }

    return prisma.transferRequest.findUniqueOrThrow({
      where: { id },
      select: transferRequestSelect,
    });
  }
}

export default new TransferRequestRepository();
