import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";

import type { Notification, UnreadCount } from "../types/notification";

async function getNotifications(page = 1, limit = 20) {
  const response = await api.get<ApiResponse<Notification[]>>(
    "/notifications",
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data.data;
}

async function getUnreadNotifications() {
  const response = await api.get<ApiResponse<Notification[]>>(
    "/notifications/unread",
  );

  return response.data.data;
}

async function getUnreadCount() {
  const response = await api.get<ApiResponse<UnreadCount>>(
    "/notifications/unread-count",
  );

  return response.data.data;
}

async function markAsRead(id: string) {
  const response = await api.patch<ApiResponse<Notification>>(
    `/notifications/${id}/read`,
  );

  return response.data.data;
}

async function markAllAsRead() {
  const response = await api.patch<
    ApiResponse<{
      updatedCount: number;
    }>
  >("/notifications/read-all");

  return response.data.data;
}

async function deleteNotification(id: string) {
  await api.delete(`/notifications/${id}`);
}

export const notificationService = {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
