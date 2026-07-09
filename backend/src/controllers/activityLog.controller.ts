import type { Request, Response } from "express";

import activityLogService from "../services/activityLog.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Get All Activity Logs
 */
export const getActivityLogs = asyncHandler(
  async (_req: Request, res: Response) => {
    const logs = await activityLogService.getAll();

    res.status(200).json(
      new ApiResponse(
        200,
        logs,
        "Activity logs fetched successfully",
      ),
    );
  },
);

/**
 * Get Activity Log By ID
 */
export const getActivityLogById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const log = await activityLogService.getById(id);

    res.status(200).json(
      new ApiResponse(
        200,
        log,
        "Activity log fetched successfully",
      ),
    );
  },
);

/**
 * Delete Activity Log
 */
export const deleteActivityLog = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await activityLogService.delete(id);

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Activity log deleted successfully",
      ),
    );
  },
);