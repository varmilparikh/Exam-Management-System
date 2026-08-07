import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";
import {
  transferRequestService,
  type ApproveTransferRequestDto,
  type CreateTransferRequestDto,
} from "../api/transferRequest.service";
import { transferRequestKeys } from "../queryKeys";

function useRequestMutation<T>(
  mutationFn: (value: T) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: transferRequestKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
export function useCreateTransferRequest() {
  return useRequestMutation<CreateTransferRequestDto>(
    transferRequestService.create,
    "Transfer request submitted.",
  );
}
export function useApproveTransferRequest() {
  return useRequestMutation<{ id: string; data: ApproveTransferRequestDto }>(
    ({ id, data }) => transferRequestService.approve(id, data),
    "Transfer request approved.",
  );
}
export function useRejectTransferRequest() {
  return useRequestMutation<{ id: string; remark: string }>(
    ({ id, remark }) => transferRequestService.reject(id, remark),
    "Transfer request rejected.",
  );
}
export function useCancelTransferRequest() {
  return useRequestMutation<string>(
    transferRequestService.cancel,
    "Transfer request cancelled.",
  );
}
