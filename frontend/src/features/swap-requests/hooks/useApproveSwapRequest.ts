import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  swapRequestService,
  type ApproveSwapRequestDto,
} from "../api/swapRequest.service";

import { swapRequestKeys } from "../queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useApproveSwapRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveSwapRequestDto }) =>
      swapRequestService.approve(id, data),

    onSuccess: () => {
      toast.success("Swap request approved.");

      queryClient.invalidateQueries({
        queryKey: swapRequestKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
