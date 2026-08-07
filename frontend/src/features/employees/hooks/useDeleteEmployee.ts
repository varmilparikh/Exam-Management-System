import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/getErrorMessage";
import { employeeService } from "../api/employee.service";
import { employeeKeys } from "../queryKeys";

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.remove(id),

    onSuccess: () => {
      toast.success("Employee deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: employeeKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
