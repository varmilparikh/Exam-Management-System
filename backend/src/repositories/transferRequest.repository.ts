import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";

import {
  TransferStatus,
} from "../generated/prisma/client.js";

import {
  transferRequestSelect,
  type TransferRequestResponse,
} from "../constants/prismaSelect.js";

class TransferRequestRepository {
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
   * Get all transfer requests
   */
  async findAll(): Promise<TransferRequestResponse[]> {
    return prisma.transferRequest.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Get pending requests
   */
  async findPending(): Promise<TransferRequestResponse[]> {
    return prisma.transferRequest.findMany({
      where: {
        status: "PENDING",
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Find pending transfer request by exam duty
   */
  async findPendingByExamDuty(
    examDutyId: string,
  ): Promise<TransferRequestResponse | null> {
    return prisma.transferRequest.findFirst({
      where: {
        examDutyId,
        status: "PENDING",
        isDeleted: false,
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Find pending request by ID
   */
  async findPendingById(id: string): Promise<TransferRequestResponse | null> {
    return prisma.transferRequest.findFirst({
      where: {
        id,
        status: TransferStatus.PENDING,
        isDeleted: false,
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Find transfer request by ID including deleted check
   */
  async findByIdOrThrow(id: string): Promise<TransferRequestResponse> {
    const transferRequest = await this.findById(id);

    if (!transferRequest) {
      throw new Error("Transfer request not found");
    }

    return transferRequest;
  }

  /**
   * Find requests created by an employee
   */
  async findByFromEmployee(
    employeeId: string,
  ): Promise<TransferRequestResponse[]> {
    return prisma.transferRequest.findMany({
      where: {
        fromEmployeeId: employeeId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: transferRequestSelect,
    });
  }

  /**
   * Find requests assigned to a replacement employee
   */
  async findByToEmployee(
    employeeId: string,
  ): Promise<TransferRequestResponse[]> {
    return prisma.transferRequest.findMany({
      where: {
        toEmployeeId: employeeId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: transferRequestSelect,
    });
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
   * Soft Delete
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
}

export default new TransferRequestRepository();
