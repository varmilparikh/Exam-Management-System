import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "../api/notification.service";
import { notificationKeys } from "../queryKeys";

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}
