import { useQuery } from "@tanstack/react-query";

import { departmentService } from "../api/department.service";
import { departmentKeys } from "../queryKeys";

export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.all,
    queryFn: departmentService.getAll,
  });
}
