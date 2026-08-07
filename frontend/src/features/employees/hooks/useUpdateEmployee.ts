import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { employeeService } from "../api/employee.service";

import { getErrorMessage } from "@/lib/getErrorMessage";

import type { UpdateEmployeeDto } from "../api/employee.service";
import { employeeKeys } from "../queryKeys";

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDto }) =>
      employeeService.update(id, data),

    onSuccess: () => {
      toast.success("Employee updated successfully.");

      queryClient.invalidateQueries({
        queryKey: employeeKeys.all,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
