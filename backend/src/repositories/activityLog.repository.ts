import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";

import {
  activityLogSelect,
  type ActivityLogResponse,
} from "../constants/prismaSelect.js";
import type { ActivityLogFilters } from "../types/activityLogFilter.types.js";

class ActivityLogRepository {
  private buildFilters(filters: ActivityLogFilters): Prisma.ActivityLogWhereInput {
    return {
      isDeleted: false,
      ...(filters.action && { action: filters.action }),
      ...(filters.search && {
        OR: [
          { description: { contains: filters.search, mode: "insensitive" } },
          { employee: { name: { contains: filters.search, mode: "insensitive" } } },
          { employee: { employeeCode: { contains: filters.search, mode: "insensitive" } } },
        ],
      }),
      ...(filters.fromDate || filters.toDate
        ? {
            createdAt: {
              ...(filters.fromDate && { gte: filters.fromDate }),
              ...(filters.toDate && {
                lt: new Date(
                  Date.UTC(
                    filters.toDate.getUTCFullYear(),
                    filters.toDate.getUTCMonth(),
                    filters.toDate.getUTCDate() + 1,
                  ),
                ),
              }),
            },
          }
        : {}),
    };
  }

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
  async findAll(
    page: number,
    limit: number,
    filters: ActivityLogFilters = {},
  ): Promise<ActivityLogResponse[]> {
    return prisma.activityLog.findMany({
      where: this.buildFilters(filters),

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
  async count(filters: ActivityLogFilters = {}): Promise<number> {
    return prisma.activityLog.count({
      where: this.buildFilters(filters),
    });
  }
}

export default new ActivityLogRepository();
