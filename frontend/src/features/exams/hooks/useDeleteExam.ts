import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { examService } from "../api/exam.service";
import { examKeys } from "../queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: examService.remove,

    onSuccess: () => {
      toast.success("Exam deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: examKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
