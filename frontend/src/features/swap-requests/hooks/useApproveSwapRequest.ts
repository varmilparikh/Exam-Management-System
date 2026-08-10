import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  swapRequestService,
  type ApproveSwapRequestDto,
} from "../api/swapRequest.service";

import { swapRequestKeys } from "../queryKeys";

import { examDutyKeys } from "@/features/exam-duties/queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useApproveSwapRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveSwapRequestDto }) =>
      swapRequestService.approve(id, data),

    onSuccess: () => {
      toast.success("Swap request approved.");

      // Refresh swap request pages
      queryClient.invalidateQueries({
        queryKey: swapRequestKeys.all,
      });

      // Refresh Exam Duties / My Duties
      queryClient.invalidateQueries({
        queryKey: examDutyKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
