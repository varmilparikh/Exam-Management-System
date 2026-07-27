import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";

import { examSelect, type ExamResponse } from "../constants/prismaSelect.js";

class ExamRepository {
  /**
   * Find exam by ID
   */
  async findById(id: string): Promise<ExamResponse | null> {
    return prisma.exam.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: examSelect,
    });
  }

  /**
   * Get all exams
   */
  async findAll(): Promise<ExamResponse[]> {
    return prisma.exam.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        examDate: "asc",
      },
      select: examSelect,
    });
  }

  async findDuplicate(
    examName: string,
    examDate: Date,
  ): Promise<ExamResponse | null> {
    return prisma.exam.findFirst({
      where: {
        examName,
        examDate,
        isDeleted: false,
      },
      select: examSelect,
    });
  }

  async findDuplicateExceptId(
    id: string,
    examName: string,
    examDate: Date,
  ): Promise<ExamResponse | null> {
    return prisma.exam.findFirst({
      where: {
        examName,
        examDate,
        isDeleted: false,
        NOT: {
          id,
        },
      },
      select: examSelect,
    });
  }

  /**
   * Create exam
   */
  async create(data: Prisma.ExamCreateInput): Promise<ExamResponse> {
    return prisma.exam.create({
      data,
      select: examSelect,
    });
  }

  /**
   * Update exam
   */
  async update(
    id: string,
    data: Prisma.ExamUpdateInput,
  ): Promise<ExamResponse> {
    return prisma.exam.update({
      where: {
        id,
      },
      data,
      select: examSelect,
    });
  }

  /**
   * Soft delete exam
   */
  async softDelete(id: string): Promise<ExamResponse> {
    return prisma.exam.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      select: examSelect,
    });
  }
}

export default new ExamRepository();
