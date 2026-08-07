import { useQuery } from "@tanstack/react-query";

import { notificationKeys } from "../queryKeys";
import { notificationService } from "../api/notification.service";

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: notificationService.getUnreadCount,
  });
}
