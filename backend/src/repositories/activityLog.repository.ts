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
  async findById(
    id: string,
  ): Promise<ActivityLogResponse | null> {
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
  async findAll(): Promise<ActivityLogResponse[]> {
    return prisma.activityLog.findMany({
      where: {
        isDeleted: false,
      },
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
   * Soft delete activity log
   */
  async softDelete(
    id: string,
  ): Promise<ActivityLogResponse> {
    return prisma.activityLog.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      select: activityLogSelect,
    });
  }
}

export default new ActivityLogRepository();