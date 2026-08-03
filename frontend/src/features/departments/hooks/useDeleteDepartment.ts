import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { departmentService } from "../api/department.service";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.remove(id),

    onSuccess: () => {
      toast.success("Department deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
