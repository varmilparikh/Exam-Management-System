import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "../queryKeys";
import { dashboardService } from "../api/dashboard.service";

export function useFacultyDashboard() {
  return useQuery({
    queryKey: dashboardKeys.faculty,
    queryFn: dashboardService.getFacultyDashboard,
  });
}
