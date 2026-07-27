/**
 * Create Notification DTO
 */
export interface CreateNotificationDto {
  employeeId: string;
  title: string;
  message: string;
}

/**
 * Update Notification DTO
 */
export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  isRead?: boolean;
}

/**
 * Get Notifications Query
 */
export interface NotificationQueryDto {
  unreadOnly?: boolean;
}