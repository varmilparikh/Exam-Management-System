import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  swapRequestService,
  type RejectSwapRequestDto,
} from "../api/swapRequest.service";

import { swapRequestKeys } from "../queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useRejectSwapRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectSwapRequestDto }) =>
      swapRequestService.reject(id, data),

    onSuccess: () => {
      toast.success("Swap request rejected.");

      queryClient.invalidateQueries({
        queryKey: swapRequestKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
