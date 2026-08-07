import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { examService } from "../api/exam.service";
import { examKeys } from "../queryKeys";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof examService.update>[1];
    }) => examService.update(id, data),

    onSuccess: () => {
      toast.success("Exam updated successfully.");

      queryClient.invalidateQueries({
        queryKey: examKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
