import { useQuery } from "@tanstack/react-query";

import { employeeService } from "../api/employee.service";
import { employeeKeys } from "../queryKeys";
import type { EmployeeFilters } from "../types/employeeFilters";

const DEFAULT_FILTERS: EmployeeFilters = {
  search: "",
  departmentId: "",
  role: "",
  status: "",
};

export function useEmployees(filters: EmployeeFilters = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: [...employeeKeys.all, filters],

    queryFn: () => employeeService.getAll(filters),
  });
}
