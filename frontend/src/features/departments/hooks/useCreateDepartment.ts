import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { departmentService } from "../api/department.service";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { departmentKeys } from "../queryKeys";

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentService.create,

    onSuccess: () => {
      toast.success("Department created successfully.");

      queryClient.invalidateQueries({
        queryKey: departmentKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
