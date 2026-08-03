import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { employeeService } from "../api/employee.service";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.create,

    onSuccess: () => {
      toast.success("Employee created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
