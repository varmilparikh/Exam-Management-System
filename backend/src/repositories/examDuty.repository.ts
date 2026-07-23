import prisma from "../config/prisma.js";

import { DutyStatus, type Prisma } from "../generated/prisma/client.js";

import {
  examDutySelect,
  type ExamDutyResponse,
} from "../constants/prismaSelect.js";

class ExamDutyRepository {
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
