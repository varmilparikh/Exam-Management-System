import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "../queryKeys";
import { dashboardService } from "../api/dashboard.service";

export function useFacultyWorkload(limit = 10) {
  return useQuery({
    queryKey: [...dashboardKeys.facultyWorkload, limit],
    queryFn: () => dashboardService.getFacultyWorkload(limit),
  });
}
