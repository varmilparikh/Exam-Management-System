import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { employeeService } from "../api/employee.service";

import { getErrorMessage } from "@/lib/getErrorMessage";

export function useUpdateEmployee() {
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
    }) => employeeService.update(id, data),

    onSuccess: () => {
      toast.success("Employee updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
