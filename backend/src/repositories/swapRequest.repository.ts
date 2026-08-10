import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/apiError.js";
import { SwapStatus } from "../generated/prisma/client.js";
import type { ApproveSwapTransactionData } from "../types/swapRequest.types.js";
import {
  swapRequestSelect,
  type SwapRequestResponse,
} from "../constants/prismaSelect.js";

import type { SwapRequestFilters } from "../types/swapRequestFilter.types.js";

class SwapRequestRepository {
  private buildFilters(
    filters: SwapRequestFilters,
  ): Prisma.SwapRequestWhereInput {
    const where: Prisma.SwapRequestWhereInput = {
      isDeleted: false,
    };

    if (filters.status) {
      where.status = filters.status as SwapStatus;
    }

    if (filters.search) {
      where.OR = [
        {
          requester: {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        },
        {
          receiver: {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        },
        {
          requesterDuty: {
            exam: {
              examName: {
                contains: filters.search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          receiverDuty: {
            exam: {
              examName: {
                contains: filters.search,
                mode: "insensitive",
              },
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
  async findById(id: string): Promise<SwapRequestResponse | null> {
    return prisma.swapRequest.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: swapRequestSelect,
    });
  }

  /**
   * Find all
   */
  async findAll(
    page: number,
    limit: number,
    filters: SwapRequestFilters,
  ): Promise<SwapRequestResponse[]> {
    const where = this.buildFilters(filters);

    return prisma.swapRequest.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: swapRequestSelect,
    });
  }

  /**
   * Pending requests
   */
  async findPending(): Promise<SwapRequestResponse[]> {
    return prisma.swapRequest.findMany({
      where: {
        status: SwapStatus.PENDING,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: swapRequestSelect,
    });
  }

  /**
   * Find pending swap request between two duties
   */
  async findPendingByDuties(
    requesterDutyId: string,
    receiverDutyId: string,
  ): Promise<SwapRequestResponse | null> {
    return prisma.swapRequest.findFirst({
      where: {
        status: SwapStatus.PENDING,
        isDeleted: false,
        OR: [
          {
            requesterDutyId,
            receiverDutyId,
          },
          {
            requesterDutyId: receiverDutyId,
            receiverDutyId: requesterDutyId,
          },
        ],
      },
      select: swapRequestSelect,
    });
  }

  /**
   * Requests created by requester
   */
  /**
   * Requests for a faculty (sent or received)
   */
  async findForFaculty(
    employeeId: string,
    page: number,
    limit: number,
    filters: SwapRequestFilters,
  ): Promise<SwapRequestResponse[]> {
    const where: Prisma.SwapRequestWhereInput = {
      ...this.buildFilters(filters),

      AND: [
        {
          OR: [{ requesterId: employeeId }, { receiverId: employeeId }],
        },
      ],
    };

    return prisma.swapRequest.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: swapRequestSelect,
    });
  }

  /**
   * Create
   */
  async create(
    data: Prisma.SwapRequestCreateInput,
  ): Promise<SwapRequestResponse> {
    return prisma.swapRequest.create({
      data,
      select: swapRequestSelect,
    });
  }

  /**
   * Update
   */
  async update(
    id: string,
    data: Prisma.SwapRequestUpdateInput,
  ): Promise<SwapRequestResponse> {
    return prisma.swapRequest.update({
      where: {
        id,
      },
      data,
      select: swapRequestSelect,
    });
  }

  /**
   * Soft delete
   */
  async softDelete(id: string): Promise<SwapRequestResponse> {
    return prisma.swapRequest.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      select: swapRequestSelect,
    });
  }

  async approveSwapTransaction(
    data: ApproveSwapTransactionData,
  ): Promise<SwapRequestResponse> {
    return prisma.$transaction(async (tx) => {
      // 1. Lock/verify the swap request is still ACCEPTED
      const request = await tx.swapRequest.findFirst({
        where: {
          id: data.id,
          status: SwapStatus.ACCEPTED,
          isDeleted: false,
        },
        select: {
          id: true,
          requesterDutyId: true,
          receiverDutyId: true,
          requesterId: true,
          receiverId: true,
        },
      });

      if (!request) {
        throw new ApiError(
          409,
          "This swap request has already been processed or is no longer available.",
        );
      }

      // 2. Verify the two duties still belong to the expected faculties
      const requesterDuty = await tx.examDuty.findFirst({
        where: {
          id: data.requesterDutyId,
          employeeId: data.requesterId,
          isDeleted: false,
        },
        select: {
          id: true,
          employeeId: true,
        },
      });

      const receiverDuty = await tx.examDuty.findFirst({
        where: {
          id: data.receiverDutyId,
          employeeId: data.receiverId,
          isDeleted: false,
        },
        select: {
          id: true,
          employeeId: true,
        },
      });

      if (!requesterDuty || !receiverDuty) {
        throw new ApiError(
          409,
          "The duties have changed since the swap request was created. Please create a new swap request.",
        );
      }

      /*
       * Temporarily clear the employee assignments.
       *
       * This prevents a possible unique(employeeId, examId)
       * conflict while exchanging assignments.
       */
      await tx.examDuty.update({
        where: {
          id: data.requesterDutyId,
        },
        data: {
          employeeId: null,
        },
      });

      await tx.examDuty.update({
        where: {
          id: data.receiverDutyId,
        },
        data: {
          employeeId: null,
        },
      });

      // 3. Faculty B receives Faculty A's duty
      await tx.examDuty.update({
        where: {
          id: data.requesterDutyId,
        },
        data: {
          employeeId: data.receiverId,
        },
      });

      // 4. Faculty A receives Faculty B's duty
      await tx.examDuty.update({
        where: {
          id: data.receiverDutyId,
        },
        data: {
          employeeId: data.requesterId,
        },
      });

      // 5. Mark request as APPROVED
      const result = await tx.swapRequest.updateMany({
        where: {
          id: data.id,
          status: SwapStatus.ACCEPTED,
        },
        data: {
          status: SwapStatus.APPROVED,
          approvedById: data.approvedById,
          approvedAt: new Date(),
          approvalRemark: data.approvalRemark,
        },
      });

      if (result.count === 0) {
        throw new ApiError(
          409,
          "This swap request has already been processed.",
        );
      }

      // 6. Return updated request
      return tx.swapRequest.findUniqueOrThrow({
        where: {
          id: data.id,
        },
        select: swapRequestSelect,
      });
    });
  }
}

export default new SwapRequestRepository();
