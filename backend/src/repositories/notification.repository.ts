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
  async findById(
    id: string,
  ): Promise<NotificationResponse | null> {
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
  async findByEmployeeId(
    employeeId: string,
  ): Promise<NotificationResponse[]> {
    return prisma.notification.findMany({
      where: {
        employeeId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: notificationSelect,
    });
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
  async softDelete(
    id: string,
  ): Promise<NotificationResponse> {
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