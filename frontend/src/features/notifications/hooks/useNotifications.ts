import { useQuery } from "@tanstack/react-query";

import { notificationKeys } from "../queryKeys";
import { notificationService } from "../api/notification.service";

export function useNotifications(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...notificationKeys.list, page, limit],
    queryFn: () => notificationService.getNotifications(page, limit),
  });
}
