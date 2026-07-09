import type { Request, Response } from "express";

import notificationService from "../services/notification.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Create Notification
 */
export const createNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.create(req.body);

    res.status(201).json(
      new ApiResponse(
        201,
        notification,
        "Notification created successfully",
      ),
    );
  },
);

/**
 * Get All Notifications
 */
export const getNotifications = asyncHandler(
  async (_req: Request, res: Response) => {
    const notifications = await notificationService.getAll();

    res.status(200).json(
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
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const notification = await notificationService.getById(id);

    res.status(200).json(
      new ApiResponse(
        200,
        notification,
        "Notification fetched successfully",
      ),
    );
  },
);

/**
 * Update Notification
 */
export const updateNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const notification = await notificationService.update(
      id,
      req.body,
    );

    res.status(200).json(
      new ApiResponse(
        200,
        notification,
        "Notification updated successfully",
      ),
    );
  },
);

/**
 * Delete Notification
 */
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await notificationService.delete(id);

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Notification deleted successfully",
      ),
    );
  },
);