import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  swapRequestService,
  type RejectSwapByCoeDto,
} from "../api/swapRequest.service";

import { swapRequestKeys } from "../queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useRejectSwapByCoe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectSwapByCoeDto }) =>
      swapRequestService.rejectByCoe(id, data),

    onSuccess: () => {
      toast.success("Swap request rejected successfully.");

      queryClient.invalidateQueries({
        queryKey: swapRequestKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
