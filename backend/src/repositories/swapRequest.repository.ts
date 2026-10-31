import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/apiError.js";
import {
  DutyStatus,
  ExamOptInStatus,
  ExamStatus,
  SwapStatus,
} from "../generated/prisma/client.js";
import {
  swapRequestSelect,
  type SwapRequestResponse,
} from "../constants/prismaSelect.js";
import { hasSessionStarted } from "../utils/examSession.utils.js";

import type { SwapRequestFilters } from "../types/swapRequestFilter.types.js";

class SwapRequestRepository {
  async completeAcceptedSwapTransaction(
    id: string,
    receiverId: string,
  ): Promise<SwapRequestResponse> {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const request = await tx.swapRequest.findFirst({
            where: {
              id,
              receiverId,
              status: { in: [SwapStatus.PENDING, SwapStatus.ACCEPTED] },
              isDeleted: false,
            },
            select: {
              id: true,
              requesterId: true,
              receiverId: true,
              requesterDutyId: true,
              receiverDutyId: true,
            },
          });
          if (!request)
            throw new ApiError(
              409,
              "This swap request has already been processed or is no longer available.",
            );

          const [requesterDuty, receiverDuty] = await Promise.all([
            tx.examDuty.findFirst({
              where: {
                id: request.requesterDutyId,
                employeeId: request.requesterId,
                isDeleted: false,
                status: DutyStatus.ASSIGNED,
              },
              select: {
                id: true,
                employeeId: true,
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
            }),
            tx.examDuty.findFirst({
              where: {
                id: request.receiverDutyId,
                employeeId: request.receiverId,
                isDeleted: false,
                status: DutyStatus.ASSIGNED,
              },
              select: {
                id: true,
                employeeId: true,
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
            }),
          ]);
          if (!requesterDuty || !receiverDuty)
            throw new ApiError(
              409,
              "The duties changed since this request was created.",
            );
          if (
            requesterDuty.exam.status !== ExamStatus.UPCOMING ||
            receiverDuty.exam.status !== ExamStatus.UPCOMING ||
            hasSessionStarted(requesterDuty.exam) ||
            hasSessionStarted(receiverDuty.exam)
          ) {
            throw new ApiError(
              409,
              "Only upcoming exam sessions can be swapped.",
            );
          }

          const dutyIds = [request.requesterDutyId, request.receiverDutyId];
          const [
            requesterOverlap,
            receiverOverlap,
            requesterOptIn,
            receiverOptIn,
          ] = await Promise.all([
            tx.examDuty.findFirst({
              where: {
                employeeId: request.requesterId,
                isDeleted: false,
                id: { notIn: dutyIds },
                exam: {
                  isDeleted: false,
                  examDate: receiverDuty.exam.examDate,
                  startTime: { lt: receiverDuty.exam.endTime },
                  endTime: { gt: receiverDuty.exam.startTime },
                },
              },
              select: { id: true },
            }),
            tx.examDuty.findFirst({
              where: {
                employeeId: request.receiverId,
                isDeleted: false,
                id: { notIn: dutyIds },
                exam: {
                  isDeleted: false,
                  examDate: requesterDuty.exam.examDate,
                  startTime: { lt: requesterDuty.exam.endTime },
                  endTime: { gt: requesterDuty.exam.startTime },
                },
              },
              select: { id: true },
            }),
            tx.examOptIn.findFirst({
              where: {
                employeeId: request.requesterId,
                status: {
                  in: [ExamOptInStatus.PENDING, ExamOptInStatus.CONFIRMED],
                },
                examId: { notIn: [requesterDuty.examId, receiverDuty.examId] },
                exam: {
                  isDeleted: false,
                  examDate: receiverDuty.exam.examDate,
                  startTime: { lt: receiverDuty.exam.endTime },
                  endTime: { gt: receiverDuty.exam.startTime },
                },
              },
              select: { id: true },
            }),
            tx.examOptIn.findFirst({
              where: {
                employeeId: request.receiverId,
                status: {
                  in: [ExamOptInStatus.PENDING, ExamOptInStatus.CONFIRMED],
                },
                examId: { notIn: [requesterDuty.examId, receiverDuty.examId] },
                exam: {
                  isDeleted: false,
                  examDate: requesterDuty.exam.examDate,
                  startTime: { lt: requesterDuty.exam.endTime },
                  endTime: { gt: requesterDuty.exam.startTime },
                },
              },
              select: { id: true },
            }),
          ]);
          if (
            requesterOverlap ||
            receiverOverlap ||
            requesterOptIn ||
            receiverOptIn
          ) {
            throw new ApiError(
              409,
              "The swap would conflict with another duty or opt-in.",
            );
          }

          await tx.examDuty.update({
            where: { id: request.requesterDutyId },
            data: { employeeId: null },
          });
          await tx.examDuty.update({
            where: { id: request.receiverDutyId },
            data: { employeeId: null },
          });
          await tx.examDuty.update({
            where: { id: request.requesterDutyId },
            data: { employeeId: request.receiverId },
          });
          await tx.examDuty.update({
            where: { id: request.receiverDutyId },
            data: { employeeId: request.requesterId },
          });

          const updated = await tx.swapRequest.updateMany({
            where: {
              id,
              receiverId,
              status: { in: [SwapStatus.PENDING, SwapStatus.ACCEPTED] },
              isDeleted: false,
            },
            data: { status: SwapStatus.COMPLETED, completedAt: new Date() },
          });
          if (updated.count !== 1)
            throw new ApiError(
              409,
              "This swap request has already been processed.",
            );
          return tx.swapRequest.findUniqueOrThrow({
            where: { id },
            select: swapRequestSelect,
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
          "A duty changed during the swap. Please retry.",
        );
      }
      throw error;
    }
  }

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

  async findForDepartment(
    departmentId: string,
    page: number,
    limit: number,
    filters: SwapRequestFilters,
  ): Promise<SwapRequestResponse[]> {
    return prisma.swapRequest.findMany({
      where: {
        AND: [
          this.buildFilters(filters),
          { requester: { departmentId, isDeleted: false } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
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
}

export default new SwapRequestRepository();
