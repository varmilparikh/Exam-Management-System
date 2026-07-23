import type { Request, Response } from "express";

import dashboardService from "../services/dashboard.service.js";

import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCoeDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await dashboardService.getCoeDashboard();

    res
      .status(200)
      .json(new ApiResponse(200, dashboard, "Dashboard fetched successfully"));
  },
);

export const getFacultyDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await dashboardService.getFacultyDashboard(req.user!.id);

    res
      .status(200)
      .json(new ApiResponse(200, dashboard, "Dashboard fetched successfully"));
  },
);

export const getHodDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await dashboardService.getHodDashboard(req.user!.id);

    res
      .status(200)
      .json(new ApiResponse(200, dashboard, "Dashboard fetched successfully"));
  },
);

export const getRecentActivities = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;

    const activities = await dashboardService.getRecentActivities(limit);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          activities,
          "Recent activities fetched successfully",
        ),
      );
  },
);

/**
 * Get Upcoming Exams
 */
export const getUpcomingExams = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 5;

    const exams = await dashboardService.getUpcomingExams(limit);

    res
      .status(200)
      .json(new ApiResponse(200, exams, "Upcoming exams fetched successfully"));
  },
);

/**
 * Get Pending Requests
 */
export const getPendingRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 5;

    const requests = await dashboardService.getPendingRequests(limit);

    res
      .status(200)
      .json(
        new ApiResponse(200, requests, "Pending requests fetched successfully"),
      );
  },
);

/**
 * Get Faculty Workload
 */
export const getFacultyWorkload = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;

    const workload = await dashboardService.getFacultyWorkload(limit);

    res
      .status(200)
      .json(
        new ApiResponse(200, workload, "Faculty workload fetched successfully"),
      );
  },
);
