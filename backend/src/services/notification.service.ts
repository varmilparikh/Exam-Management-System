import notificationRepository from "../repositories/notification.repository.js";
import employeeRepository from "../repositories/employee.repository.js";

import { ApiError } from "../utils/apiError.js";

import type {
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../types/notification.types.js";

import type {
  NotificationResponse,
} from "../constants/prismaSelect.js";

class NotificationService {
  /**
   * Create Notification
   */
  async create(
    data: CreateNotificationDto,
  ): Promise<NotificationResponse> {
    const employee = await employeeRepository.findById(
      data.employeeId,
    );

    if (!employee) {
      throw new ApiError(
        404,
        "Employee not found",
      );
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
  ): Promise<NotificationResponse[]> {
    return notificationRepository.findByEmployeeId(
      employeeId,
    );
  }

  /**
   * Get Notification By ID
   */
  async getById(
    id: string,
  ): Promise<NotificationResponse> {
    const notification =
      await notificationRepository.findById(id);

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found",
      );
    }

    return notification;
  }

  /**
   * Mark Notification As Read
   */
  async update(
    id: string,
    data: UpdateNotificationDto,
  ): Promise<NotificationResponse> {
    const notification =
      await notificationRepository.findById(id);

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found",
      );
    }

    return notificationRepository.update(id, {
      ...data,
    });
  }

  /**
   * Soft Delete Notification
   */
  async delete(
    id: string,
  ): Promise<NotificationResponse> {
    const notification =
      await notificationRepository.findById(id);

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found",
      );
    }

    return notificationRepository.softDelete(id);
  }
}

export default new NotificationService();