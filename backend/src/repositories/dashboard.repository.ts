import prisma from "../config/prisma.js";

import { Role } from "../generated/prisma/client.js";

import {
  DutyStatus,
  ExamStatus,
  SwapStatus,
  TransferStatus,
} from "../generated/prisma/client.js";

import {
  activityLogSelect,
  type ActivityLogResponse,
} from "../constants/prismaSelect.js";

class DashboardRepository {
  async countEmployees(): Promise<number> {
    return prisma.employee.count({
      where: {
        isDeleted: false,
      },
    });
  }

  async getDepartmentIdByEmployee(employeeId: string): Promise<string | null> {
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      select: {
        departmentId: true,
      },
    });

    return employee?.departmentId ?? null;
  }

  async countFacultyByDepartment(departmentId: string): Promise<number> {
    return prisma.employee.count({
      where: {
        departmentId,
        isDeleted: false,
        role: Role.FACULTY,
      },
    });
  }

  async countUpcomingDepartmentDuties(departmentId: string): Promise<number> {
    return prisma.examDuty.count({
      where: {
        status: DutyStatus.ASSIGNED,
        employee: {
          departmentId,
          isDeleted: false,
        },
        exam: {
          status: ExamStatus.UPCOMING,
          isDeleted: false,
        },
      },
    });
  }

  /**
   * Count Pending Swap Requests For Department
   */
  async countDepartmentPendingSwaps(departmentId: string): Promise<number> {
    return prisma.swapRequest.count({
      where: {
        status: SwapStatus.PENDING,
        isDeleted: false,

        requester: {
          departmentId,
          isDeleted: false,
        },
      },
    });
  }

  /**
   * Count Pending Transfer Requests For Department
   */
  async countDepartmentPendingTransfers(departmentId: string): Promise<number> {
    return prisma.transferRequest.count({
      where: {
        status: TransferStatus.PENDING,
        isDeleted: false,

        fromEmployee: {
          departmentId,
          isDeleted: false,
        },
      },
    });
  }

  async countDepartments(): Promise<number> {
    return prisma.department.count({
      where: {
        isDeleted: false,
      },
    });
  }

  async countUpcomingExams(): Promise<number> {
    return prisma.exam.count({
      where: {
        isDeleted: false,
        status: ExamStatus.UPCOMING,
      },
    });
  }

  async countTodayExams(): Promise<number> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return prisma.exam.count({
      where: {
        isDeleted: false,
        examDate: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async countAssignedDuties(): Promise<number> {
    return prisma.examDuty.count({
      where: {
        isDeleted: false,
        status: DutyStatus.ASSIGNED,
      },
    });
  }

  /**
   * Count Completed Exams
   */
  async countCompletedExams(): Promise<number> {
    return prisma.exam.count({
      where: {
        isDeleted: false,
        status: ExamStatus.COMPLETED,
      },
    });
  }

  async countPendingTransferRequests(): Promise<number> {
    return prisma.transferRequest.count({
      where: {
        isDeleted: false,
        status: TransferStatus.PENDING,
      },
    });
  }

  /**
   * Count Pending Transfer Requests By Employee
   */
  async countPendingTransfersByEmployee(employeeId: string): Promise<number> {
    return prisma.transferRequest.count({
      where: {
        fromEmployeeId: employeeId,
        status: TransferStatus.PENDING,
        isDeleted: false,
      },
    });
  }

  async countPendingSwapRequests(): Promise<number> {
    return prisma.swapRequest.count({
      where: {
        isDeleted: false,
        status: SwapStatus.PENDING,
      },
    });
  }

  /**
   * Count Pending Swap Requests By Employee
   */
  async countPendingSwapsByEmployee(employeeId: string): Promise<number> {
    return prisma.swapRequest.count({
      where: {
        requesterId: employeeId,
        status: SwapStatus.PENDING,
        isDeleted: false,
      },
    });
  }

  async countCompletedDuties(employeeId: string): Promise<number> {
    return prisma.examDuty.count({
      where: {
        employeeId,
        status: DutyStatus.ATTENDED,
      },
    });
  }

  async countUpcomingDuties(employeeId: string): Promise<number> {
    return prisma.examDuty.count({
      where: {
        employeeId,
        status: DutyStatus.ASSIGNED,
        exam: {
          status: ExamStatus.UPCOMING,
          isDeleted: false,
        },
      },
    });
  }

  /**
   * Count Activity Logs
   */
  async countActivityLogs(): Promise<number> {
    return prisma.activityLog.count({
      where: {
        isDeleted: false,
      },
    });
  }

  /**
   * Count Notifications
   */
  async countNotifications(): Promise<number> {
    return prisma.notification.count({
      where: {
        isDeleted: false,
      },
    });
  }

  async countUnreadNotifications(employeeId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        employeeId,
        isRead: false,
        isDeleted: false,
      },
    });
  }

  /**
   * Get Recent Activities
   */
  async getRecentActivities(
    limit: number = 10,
  ): Promise<ActivityLogResponse[]> {
    return prisma.activityLog.findMany({
      where: {
        isDeleted: false,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,

      select: activityLogSelect,
    });
  }

  /**
   * Get Upcoming Exams
   */
  async getUpcomingExams(limit: number = 5) {
    return prisma.exam.findMany({
      where: {
        status: ExamStatus.UPCOMING,
        isDeleted: false,
      },

      orderBy: {
        examDate: "asc",
      },

      take: limit,

      select: {
        id: true,
        examName: true,
        examDate: true,
        requiredFaculty: true,
        status: true,
        createdAt: true,
      },
    });
  }

  /**
   * Get Pending Transfer Requests
   */
  async getPendingTransferRequests(limit: number = 5) {
    return prisma.transferRequest.findMany({
      where: {
        status: TransferStatus.PENDING,
        isDeleted: false,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,

      select: {
        id: true,
        status: true,
        reason: true,
        createdAt: true,

        fromEmployee: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
          },
        },

        toEmployee: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
          },
        },

        examDuty: {
          select: {
            id: true,

            exam: {
              select: {
                id: true,
                examName: true,
                examDate: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get Pending Swap Requests
   */
  async getPendingSwapRequests(limit: number = 5) {
    return prisma.swapRequest.findMany({
      where: {
        status: SwapStatus.PENDING,
        isDeleted: false,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,

      select: {
        id: true,
        status: true,
        reason: true,
        createdAt: true,

        requester: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
          },
        },

        receiver: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
          },
        },

        requesterDuty: {
          select: {
            exam: {
              select: {
                id: true,
                examName: true,
                examDate: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get Faculty Workload
   */
  async getFacultyWorkload(limit: number = 10) {
    return prisma.employee.findMany({
      where: {
        role: Role.FACULTY,
        isDeleted: false,
        isActive: true,
      },

      orderBy: [
        {
          attendedCount: "desc",
        },
        {
          transferCount: "asc",
        },
      ],

      take: limit,

      select: {
        id: true,
        employeeCode: true,
        name: true,
        designation: true,
        attendedCount: true,
        averageDuty: true,
        transferCount: true,
      },
    });
  }
}

export default new DashboardRepository();
