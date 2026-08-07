import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  swapRequestService,
  type CreateSwapRequestDto,
} from "../api/swapRequest.service";

import { swapRequestKeys } from "../queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useCreateSwapRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSwapRequestDto) => swapRequestService.create(data),

    onSuccess: () => {
      toast.success("Swap request created successfully.");

      queryClient.invalidateQueries({
        queryKey: swapRequestKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
