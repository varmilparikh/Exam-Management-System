import activityLogRepository from "../repositories/activityLog.repository.js";

import { ApiError } from "../utils/apiError.js";

import type { CreateActivityLogDto } from "../types/activityLog.types.js";

import { ActivityLogResponse } from "../constants/prismaSelect.js";

class ActivityLogService {
  /**
   * Create Activity Log
   */
  async log(data: CreateActivityLogDto): Promise<ActivityLogResponse> {
    return activityLogRepository.create({
      action: data.action,
      description: data.description,
      entityType: data.entityType,
      entityId: data.entityId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,

      employee: {
        connect: {
          id: data.employeeId,
        },
      },
    });
  }

  /**
   * Get All Activity Logs
   */
  async getAll(page: number, limit: number) {
    const [logs, total] = await Promise.all([
      activityLogRepository.findAll(page, limit),
      activityLogRepository.count(),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      logs,
    };
  }

  /**
   * Get Activity Log By ID
   */
  async getById(id: string): Promise<ActivityLogResponse> {
    const activityLog = await activityLogRepository.findById(id);

    if (!activityLog) {
      throw new ApiError(404, "Activity log not found");
    }

    return activityLog;
  }

  /**
   * Get My Activity Logs
   */
  async getMyLogs(
    employeeId: string,
    page: number,
    limit: number,
  ): Promise<ActivityLogResponse[]> {
    return activityLogRepository.findByEmployee(employeeId, page, limit);
  }
}

export default new ActivityLogService();
