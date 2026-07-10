import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";

import {
  examDutySelect,
  type ExamDutyResponse,
} from "../constants/prismaSelect.js";

class ExamDutyRepository {
  /**
   * Find Exam Duty by ID
   */
  async findById(
    id: string,
  ): Promise<ExamDutyResponse | null> {
    return prisma.examDuty.findFirst({
      where: {
        id,
      },
      select: examDutySelect,
    });
  }

  /**
   * Find all Exam Duties
   */
  async findAll(): Promise<ExamDutyResponse[]> {
    return prisma.examDuty.findMany({
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
      },
      select: examDutySelect,
    });
  }

  /**
   * Count assigned faculty for an exam
   */
  async countByExam(
    examId: string,
  ): Promise<number> {
    return prisma.examDuty.count({
      where: {
        examId,
      },
    });
  }

  /**
   * Create Exam Duty
   */
  async create(
    data: Prisma.ExamDutyCreateInput,
  ): Promise<ExamDutyResponse> {
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
      },
      data,
      select: examDutySelect,
    });
  }
}

export default new ExamDutyRepository();