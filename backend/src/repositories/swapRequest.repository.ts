import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/apiError.js";
import { SwapStatus } from "../generated/prisma/client.js";
import type { ApproveSwapTransactionData } from "../types/swapRequest.types.js";
import {
  swapRequestSelect,
  type SwapRequestResponse,
} from "../constants/prismaSelect.js";

class SwapRequestRepository {
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
  async findAll(): Promise<SwapRequestResponse[]> {
    return prisma.swapRequest.findMany({
      where: {
        isDeleted: false,
      },
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
   * Accepted requests waiting for COE
   */
  async findAccepted(): Promise<SwapRequestResponse[]> {
    return prisma.swapRequest.findMany({
      where: {
        status: SwapStatus.ACCEPTED,
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
  async findByRequester(requesterId: string): Promise<SwapRequestResponse[]> {
    return prisma.swapRequest.findMany({
      where: {
        requesterId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: swapRequestSelect,
    });
  }

  /**
   * Requests received by receiver
   */
  async findByReceiver(receiverId: string): Promise<SwapRequestResponse[]> {
    return prisma.swapRequest.findMany({
      where: {
        receiverId,
        isDeleted: false,
      },
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
      await tx.examDuty.update({
        where: { id: data.requesterDutyId },
        data: { employeeId: null },
      });

      await tx.examDuty.update({
        where: { id: data.receiverDutyId },
        data: { employeeId: data.requesterId },
      });

      await tx.examDuty.update({
        where: { id: data.requesterDutyId },
        data: { employeeId: data.receiverId },
      });

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

      return tx.swapRequest.findUniqueOrThrow({
        where: { id: data.id },
        select: swapRequestSelect,
      });
    });
  }
}

export default new SwapRequestRepository();
