import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "../api/notification.service";
import { notificationKeys } from "../queryKeys";

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.deleteNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}
