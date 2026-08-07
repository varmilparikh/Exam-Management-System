export interface Notification {
  id: string;
  employeeId: string;

  title: string;
  message: string;

  isRead: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UnreadCount {
  count: number;
}
