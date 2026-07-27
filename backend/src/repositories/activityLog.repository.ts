import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";

import {
  activityLogSelect,
  type ActivityLogResponse,
} from "../constants/prismaSelect.js";

class ActivityLogRepository {
  /**
   * Find activity log by ID
   */
  async findById(id: string): Promise<ActivityLogResponse | null> {
    return prisma.activityLog.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: activityLogSelect,
    });
  }

  /**
   * Get all activity logs
   */
  async findAll(page: number, limit: number): Promise<ActivityLogResponse[]> {
    return prisma.activityLog.findMany({
      where: {
        isDeleted: false,
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: activityLogSelect,
    });
  }

  async findByEmployee(
    employeeId: string,
    page: number,
    limit: number,
  ): Promise<ActivityLogResponse[]> {
    return prisma.activityLog.findMany({
      where: {
        employeeId,
        isDeleted: false,
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: activityLogSelect,
    });
  }

  /**
   * Create activity log
   */
  async create(
    data: Prisma.ActivityLogCreateInput,
  ): Promise<ActivityLogResponse> {
    return prisma.activityLog.create({
      data,
      select: activityLogSelect,
    });
  }

  /**
   * Count all activity logs
   */
  async count(): Promise<number> {
    return prisma.activityLog.count({
      where: {
        isDeleted: false,
      },
    });
  }
}

export default new ActivityLogRepository();
