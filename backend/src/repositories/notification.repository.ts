import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";

import {
  notificationSelect,
  type NotificationResponse,
} from "../constants/prismaSelect.js";

class NotificationRepository {
  /**
   * Find notification by ID
   */
  async findById(id: string): Promise<NotificationResponse | null> {
    return prisma.notification.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: notificationSelect,
    });
  }

  /**
   * Get all notifications
   */
  async findAll(): Promise<NotificationResponse[]> {
    return prisma.notification.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: notificationSelect,
    });
  }

  /**
   * Get notifications by employee
   */
  async findByEmployee(
    employeeId: string,
    page: number,
    limit: number,
  ): Promise<NotificationResponse[]> {
    const skip = (page - 1) * limit;

    return prisma.notification.findMany({
      where: {
        employeeId,
        isDeleted: false,
      },

      skip,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: notificationSelect,
    });
  }

  /**
   * Get unread notifications by employee
   */
  async findUnreadByEmployee(
    employeeId: string,
  ): Promise<NotificationResponse[]> {
    return prisma.notification.findMany({
      where: {
        employeeId,
        isDeleted: false,
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: notificationSelect,
    });
  }

  async countUnread(employeeId: string) {
    return prisma.notification.count({
      where: {
        employeeId,
        isDeleted: false,
        isRead: false,
      },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(employeeId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: {
        employeeId,
        isDeleted: false,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return result.count;
  }

  /**
   * Create notification
   */
  async create(
    data: Prisma.NotificationCreateInput,
  ): Promise<NotificationResponse> {
    return prisma.notification.create({
      data,
      select: notificationSelect,
    });
  }

  /**
   * Update notification
   */
  async update(
    id: string,
    data: Prisma.NotificationUpdateInput,
  ): Promise<NotificationResponse> {
    return prisma.notification.update({
      where: {
        id,
      },
      data,
      select: notificationSelect,
    });
  }

  /**
   * Soft delete notification
   */
  async softDelete(id: string): Promise<NotificationResponse> {
    return prisma.notification.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      select: notificationSelect,
    });
  }
}

export default new NotificationRepository();
