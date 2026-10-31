import type { Request, Response } from "express";

import activityLogService from "../services/activityLog.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { activityLogQuerySchema } from "../validators/activityLog.validator.js";

/**
 * Get All Activity Logs
 */
export const getActivityLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, search, action, fromDate, toDate } =
      activityLogQuerySchema.parse(req.query);

    const logs = await activityLogService.getAll(page, limit, {
      search,
      action,
      fromDate,
      toDate,
    });

    res
      .status(200)
      .json(new ApiResponse(200, logs, "Activity logs fetched successfully"));
  },
);

/**
 * Get Activity Log By ID
 */
export const getActivityLogById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const log = await activityLogService.getById(id);

    res
      .status(200)
      .json(new ApiResponse(200, log, "Activity log fetched successfully"));
  },
);

/**
 * Get My Activity Logs
 */
export const getMyActivityLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = activityLogQuerySchema.parse(req.query);

    const logs = await activityLogService.getMyLogs(req.user!.id, page, limit);

    res
      .status(200)
      .json(new ApiResponse(200, logs, "Activity logs fetched successfully"));
  },
);
