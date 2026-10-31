import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "../api/notification.service";
import { notificationKeys } from "../queryKeys";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,

    onSuccess: () => {
      toast.success("Notification marked as read.");
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },

    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
