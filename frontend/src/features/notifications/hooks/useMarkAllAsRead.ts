import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "../api/notification.service";
import { notificationKeys } from "../queryKeys";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,

    onSuccess: ({ updatedCount }) => {
      toast.success(
        updatedCount === 0
          ? "There are no unread notifications."
          : `${updatedCount} notification(s) marked as read.`,
      );
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },

    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
