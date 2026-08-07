import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { swapRequestService } from "../api/swapRequest.service";
import { swapRequestKeys } from "../queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useAcceptSwapRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: swapRequestService.accept,

    onSuccess: () => {
      toast.success("Swap request accepted.");

      queryClient.invalidateQueries({
        queryKey: swapRequestKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
