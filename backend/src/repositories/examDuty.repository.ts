import prisma from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";

import {
  DutyStatus,
  ExamOptInStatus,
  ExamStatus,
  type Prisma,
} from "../generated/prisma/client.js";
import { hasSessionStarted } from "../utils/examSession.utils.js";

import {
  examDutySelect,
  type ExamDutyResponse,
} from "../constants/prismaSelect.js";

export class ExamDutyRepository {
  constructor(private readonly database: typeof prisma = prisma) {}

  async createAssignedWithCapacity(
    employeeId: string,
    examId: string,
  ): Promise<ExamDutyResponse> {
    try {
      return await this.database.$transaction(
        async (tx) => {
          const exam = await tx.exam.findFirst({
            where: { id: examId, isDeleted: false },
            select: {
              id: true,
              examDate: true,
              startTime: true,
              endTime: true,
              requiredFaculty: true,
              status: true,
            },
          });
          if (
            !exam ||
            exam.status !== ExamStatus.UPCOMING ||
            hasSessionStarted(exam)
          )
            throw new ApiError(
              409,
              "Only upcoming exam sessions can receive duty assignments.",
            );
          const duplicate = await tx.examDuty.findFirst({
            where: { employeeId, examId, isDeleted: false },
            select: { id: true },
          });
          if (duplicate)
            throw new ApiError(
              409,
              "Employee is already assigned to this exam.",
            );
          const [assignedCount, pendingOptIns, sameExamOptIn] =
            await Promise.all([
              tx.examDuty.count({
                where: { examId, isDeleted: false, employeeId: { not: null } },
              }),
              tx.examOptIn.count({ where: { examId, status: "PENDING" } }),
              tx.examOptIn.findFirst({
                where: {
                  employeeId,
                  examId,
                  status: {
                    in: [ExamOptInStatus.PENDING, ExamOptInStatus.CONFIRMED],
                  },
                },
                select: { id: true },
              }),
            ]);
          if (sameExamOptIn)
            throw new ApiError(
              409,
              "Employee already has an active opt-in for this exam. Review the opt-in instead.",
            );
          if (assignedCount + pendingOptIns >= exam.requiredFaculty)
            throw new ApiError(409, "Required faculty limit reached.");
          const overlappingDuty = await tx.examDuty.findFirst({
            where: {
              employeeId,
              isDeleted: false,
              exam: {
                isDeleted: false,
                examDate: exam.examDate,
                startTime: { lt: exam.endTime },
                endTime: { gt: exam.startTime },
              },
            },
            select: { id: true },
          });
          const overlappingOptIn = await tx.examOptIn.findFirst({
            where: {
              employeeId,
              status: { in: ["PENDING", "CONFIRMED"] },
              examId: { not: examId },
              exam: {
                isDeleted: false,
                examDate: exam.examDate,
                startTime: { lt: exam.endTime },
                endTime: { gt: exam.startTime },
              },
            },
            select: { id: true },
          });
          if (overlappingDuty || overlappingOptIn)
            throw new ApiError(
              409,
              "Employee already has a duty or opt-in during this session.",
            );
          return tx.examDuty.create({
            data: { employeeId, examId, status: DutyStatus.ASSIGNED },
            select: examDutySelect,
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
      )
        throw new ApiError(409, "The exam capacity changed. Please retry.");
      throw error;
    }
  }

  /**
   * Find Exam Duty by ID
   */
  async findById(id: string): Promise<ExamDutyResponse | null> {
    return prisma.examDuty.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: examDutySelect,
    });
  }

  /**
   * Find all Exam Duties
   */
  async findAll(
    page: number,
    limit: number,
    filters: {
      examId?: string;
      employeeId?: string;
      status?: DutyStatus;
      search?: string;
    },
  ): Promise<ExamDutyResponse[]> {
    return prisma.examDuty.findMany({
      where: {
        isDeleted: false,

        ...(filters.examId && {
          examId: filters.examId,
        }),

        ...(filters.employeeId && {
          employeeId: filters.employeeId,
        }),

        ...(filters.status && {
          status: filters.status,
        }),

        ...(filters.search && {
          OR: [
            {
              employee: {
                name: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
            },
            {
              exam: {
                examName: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }),
      },

      skip: (page - 1) * limit,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: examDutySelect,
    });
  }

  /**
   * Duties of one employee
   */
  async findByEmployee(employeeId: string): Promise<ExamDutyResponse[]> {
    return prisma.examDuty.findMany({
      where: {
        employeeId,
        isDeleted: false,
      },
      orderBy: {
        exam: {
          examDate: "asc",
        },
      },
      select: examDutySelect,
    });
  }

  /**
   * Upcoming duties of one employee
   */
  async findUpcomingByEmployee(
    employeeId: string,
    limit = 50,
  ): Promise<ExamDutyResponse[]> {
    return prisma.examDuty.findMany({
      where: {
        employeeId,
        isDeleted: false,
        status: DutyStatus.ASSIGNED,

        exam: {
          status: ExamStatus.UPCOMING,
          isDeleted: false,
        },
      },

      orderBy: {
        exam: {
          examDate: "asc",
        },
      },

      take: limit,

      select: examDutySelect,
    });
  }

  /**
   * Duties of one exam
   */
  async findByExam(examId: string): Promise<ExamDutyResponse[]> {
    return prisma.examDuty.findMany({
      where: {
        examId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: examDutySelect,
    });
  }

  /**
   * Find duty by Employee and Exam
   */
  async findByEmployeeAndExam(
    employeeId: string,
    examId: string,
  ): Promise<ExamDutyResponse | null> {
    return prisma.examDuty.findFirst({
      where: {
        employeeId,
        examId,
        isDeleted: false,
      },
      select: examDutySelect,
    });
  }

  /**
   * Count assigned faculty for an exam
   */
  async countByExam(examId: string): Promise<number> {
    return prisma.examDuty.count({
      where: {
        examId,
        isDeleted: false,
      },
    });
  }

  /**
   * Create Exam Duty
   */
  async create(data: Prisma.ExamDutyCreateInput): Promise<ExamDutyResponse> {
    return prisma.examDuty.create({
      data,
      select: examDutySelect,
    });
  }

  /**
   * Update Exam Duty
   */
  async update(
    id: string,
    data: Prisma.ExamDutyUpdateInput,
  ): Promise<ExamDutyResponse> {
    return prisma.examDuty.update({
      where: {
        id,
        isDeleted: false,
      },
      data,
      select: examDutySelect,
    });
  }

  /**
   * Soft Delete Exam Duty
   */
  async softDelete(id: string): Promise<ExamDutyResponse> {
    return prisma.examDuty.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      select: examDutySelect,
    });
  }
}

export default new ExamDutyRepository();
