import prisma from "../config/prisma.js";

import {
  DutyStatus,
  ExamStatus,
  type Prisma,
} from "../generated/prisma/client.js";

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
    limit = 5,
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
