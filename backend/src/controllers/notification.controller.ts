import type { Request, Response } from "express";

import notificationService from "../services/notification.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

import type { CreateNotificationDto } from "../types/notification.types.js";

/**
 * Create Notification
 */
export const createNotification = asyncHandler(
  async (
    req: Request<Record<string, never>, unknown, CreateNotificationDto>,
    res: Response,
  ): Promise<void> => {
    const notification = await notificationService.create(req.body);

    res
      .status(201)
      .json(
        new ApiResponse(201, notification, "Notification created successfully"),
      );
  },
);

/**
 * Get All Notifications
 */
export const getMyNotifications = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: employeeId } = req.user!;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 20;

    const notifications = await notificationService.getByEmployee(
      employeeId,
      page,
      limit,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notifications,
          "Notifications fetched successfully",
        ),
      );
  },
);

/**
 * Get Notification By ID
 */
export const getNotificationById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { id: employeeId } = req.user!;

    const notification = await notificationService.getById(employeeId, id);

    res
      .status(200)
      .json(
        new ApiResponse(200, notification, "Notification fetched successfully"),
      );
  },
);

/**
 * Mark Notification As Read
 */
export const markNotificationAsRead = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { id: employeeId } = req.user!;

    const notification = await notificationService.markAsRead(employeeId, id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notification,
          "Notification marked as read successfully",
        ),
      );
  },
);

/**
 * Mark All Notifications As Read
 */
export const markAllNotificationsAsRead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: employeeId } = req.user!;

    const updatedCount = await notificationService.markAllAsRead(employeeId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedCount },
          "All notifications marked as read successfully",
        ),
      );
  },
);

/**
 * Get Unread Notifications
 */
export const getUnreadNotifications = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: employeeId } = req.user!;

    const notifications = await notificationService.getUnread(employeeId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notifications,
          "Unread notifications fetched successfully",
        ),
      );
  },
);

export const getUnreadCount = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: employeeId } = req.user!;

    const count = await notificationService.countUnread(employeeId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { count },
          "Unread notification count fetched successfully",
        ),
      );
  },
);

/**
 * Delete Notification
 */
export const deleteNotification = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { id: employeeId } = req.user!;

    await notificationService.delete(employeeId, id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Notification deleted successfully"));
  },
);
