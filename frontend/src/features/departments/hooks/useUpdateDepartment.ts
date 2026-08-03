import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { departmentService } from "../api/department.service";

import { getErrorMessage } from "@/lib/getErrorMessage";
import { departmentKeys } from "../queryKeys";

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
      };
    }) => departmentService.update(id, data),

    onSuccess: () => {
      toast.success("Department updated successfully.");

      queryClient.invalidateQueries({
        queryKey: departmentKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
