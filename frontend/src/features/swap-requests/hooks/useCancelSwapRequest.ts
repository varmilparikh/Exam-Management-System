import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  swapRequestService,
  type CancelSwapRequestDto,
} from "../api/swapRequest.service";

import { swapRequestKeys } from "../queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useCancelSwapRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelSwapRequestDto }) =>
      swapRequestService.cancel(id, data),

    onSuccess: () => {
      toast.success("Swap request cancelled.");

      queryClient.invalidateQueries({
        queryKey: swapRequestKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
