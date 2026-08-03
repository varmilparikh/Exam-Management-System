import { useQuery } from "@tanstack/react-query";

import { employeeService } from "../api/employee.service";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
  });
}
