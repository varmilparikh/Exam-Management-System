import notificationRepository from "../repositories/notification.repository.js";
import employeeRepository from "../repositories/employee.repository.js";

import { ApiError } from "../utils/apiError.js";

import type {
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../types/notification.types.js";

import type { NotificationResponse } from "../constants/prismaSelect.js";

class NotificationService {
  /**
   * Create Notification
   */
  async create(data: CreateNotificationDto): Promise<NotificationResponse> {
    const employee = await employeeRepository.findById(data.employeeId);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    return notificationRepository.create({
      title: data.title,
      message: data.message,

      employee: {
        connect: {
          id: data.employeeId,
        },
      },
    });
  }

  /**
   * Get All Notifications
   */
  async getAll(): Promise<NotificationResponse[]> {
    return notificationRepository.findAll();
  }

  /**
   * Get Notifications By Employee
   */
  async getByEmployee(
    employeeId: string,
    page: number,
    limit: number,
  ): Promise<NotificationResponse[]> {
    return notificationRepository.findByEmployee(employeeId, page, limit);
  }

  /**
   * Get Notification By ID
   */
  async getById(employeeId: string, id: string): Promise<NotificationResponse> {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (notification.employeeId !== employeeId) {
      throw new ApiError(
        403,
        "You are not authorized to access this notification",
      );
    }

    return notification;
  }

  /**
   * Mark Notification As Read
   */
  async update(
    employeeId: string,
    id: string,
    data: UpdateNotificationDto,
  ): Promise<NotificationResponse> {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (notification.employeeId !== employeeId) {
      throw new ApiError(
        403,
        "You are not authorized to access this notification",
      );
    }

    return notificationRepository.update(id, {
      ...data,
    });
  }

  /**
   * Mark Notification As Read
   */
  async markAsRead(
    employeeId: string,
    id: string,
  ): Promise<NotificationResponse> {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (notification.employeeId !== employeeId) {
      throw new ApiError(
        403,
        "You are not authorized to access this notification",
      );
    }

    return notificationRepository.update(id, {
      isRead: true,
    });
  }

  /**
   * Mark All Notifications As Read
   */
  async markAllAsRead(employeeId: string): Promise<number> {
    return notificationRepository.markAllAsRead(employeeId);
  }

  /**
   * Get Unread Notifications
   */
  async getUnread(employeeId: string): Promise<NotificationResponse[]> {
    return notificationRepository.findUnreadByEmployee(employeeId);
  }

  async countUnread(employeeId: string): Promise<number> {
    return notificationRepository.countUnread(employeeId);
  }

  /**
   * Soft Delete Notification
   */
  async delete(employeeId: string, id: string): Promise<NotificationResponse> {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (notification.employeeId !== employeeId) {
      throw new ApiError(
        403,
        "You are not authorized to delete this notification",
      );
    }

    return notificationRepository.softDelete(id);
  }
}

export default new NotificationService();
