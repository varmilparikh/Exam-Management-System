import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "../api/notification.service";
import { notificationKeys } from "../queryKeys";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}
