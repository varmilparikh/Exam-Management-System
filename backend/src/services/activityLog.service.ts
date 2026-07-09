import activityLogRepository from "../repositories/activityLog.repository.js";

import { ApiError } from "../utils/apiError.js";

import type {
  CreateActivityLogDto,
} from "../types/activityLog.types.js";

import {
  ActivityLogResponse,
} from "../constants/prismaSelect.js";

class ActivityLogService {
  /**
   * Create Activity Log
   */
  async log(
    data: CreateActivityLogDto,
  ): Promise<ActivityLogResponse> {
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
  async getAll(): Promise<ActivityLogResponse[]> {
    return activityLogRepository.findAll();
  }

  /**
   * Get Activity Log By ID
   */
  async getById(
    id: string,
  ): Promise<ActivityLogResponse> {
    const activityLog =
      await activityLogRepository.findById(id);

    if (!activityLog) {
      throw new ApiError(
        404,
        "Activity log not found",
      );
    }

    return activityLog;
  }

  /**
   * Soft Delete Activity Log
   */
  async delete(
    id: string,
  ): Promise<ActivityLogResponse> {
    const activityLog =
      await activityLogRepository.findById(id);

    if (!activityLog) {
      throw new ApiError(
        404,
        "Activity log not found",
      );
    }

    return activityLogRepository.softDelete(id);
  }
}

export default new ActivityLogService();