import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";
import { TransferStatus, DutyStatus } from "../generated/prisma/client.js";

import {
  transferRequestSelect,
  type TransferRequestResponse,
} from "../constants/prismaSelect.js";

import type {
  ApproveTransferTransactionData,
  RejectTransferTransactionData,
} from "../types/transferRequest.types.js";

import type { TransferRequestFilters } from "../types/transferRequestFilter.types.js";

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
    approvalRemark,
  }: ApproveTransferTransactionData): Promise<TransferRequestResponse> {
    return prisma.$transaction(async (tx) => {
      await tx.transferRequest.update({
        where: {
          id,
        },

        data: {
          status: TransferStatus.APPROVED,

          approvedBy: {
            connect: {
              id: approvedById,
            },
          },

          approvedAt: new Date(),

          approvalRemark,

          toEmployee: {
            connect: {
              id: replacementEmployeeId,
            },
          },
        },
      });

      await tx.examDuty.update({
        where: {
          id: examDutyId,
        },

        data: {
          employee: {
            connect: {
              id: replacementEmployeeId,
            },
          },

          status: DutyStatus.ASSIGNED,
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
   * Reject transfer transaction
   *
   * Repository should ONLY perform database operations.
   */
  async rejectTransferTransaction({
    id,
    approvedById,
    approvalRemark,
  }: RejectTransferTransactionData): Promise<TransferRequestResponse> {
    return prisma.$transaction(async (tx) => {
      await tx.transferRequest.update({
        where: {
          id,
        },

        data: {
          status: TransferStatus.REJECTED,

          approvedBy: {
            connect: {
              id: approvedById,
            },
          },

          approvedAt: new Date(),

          approvalRemark,
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
}

export default new TransferRequestRepository();
