import { useQuery } from "@tanstack/react-query";

import { notificationKeys } from "../queryKeys";
import { notificationService } from "../api/notification.service";

export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unread,
    queryFn: notificationService.getUnreadNotifications,
  });
}
