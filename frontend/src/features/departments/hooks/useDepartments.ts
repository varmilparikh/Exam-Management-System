import { useQuery } from "@tanstack/react-query";

import { departmentService } from "../api/department.service";
import { departmentKeys } from "../queryKeys";

import type { DepartmentFilters } from "../types/departmentFilters";

const DEFAULT_FILTERS: DepartmentFilters = {
  search: "",
};

export function useDepartments(filters: DepartmentFilters = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: [...departmentKeys.all, filters],

    queryFn: () => departmentService.getAll(filters),
  });
}
