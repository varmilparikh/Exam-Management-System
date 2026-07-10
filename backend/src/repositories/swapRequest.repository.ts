import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";

import { SwapStatus } from "../generated/prisma/client.js";

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
        requesterDutyId,
        receiverDutyId,
        status: SwapStatus.PENDING,
        isDeleted: false,
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
}

export default new SwapRequestRepository();
