import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "../queryKeys";
import { dashboardService } from "../api/dashboard.service";

export function useHodDashboard() {
  return useQuery({
    queryKey: dashboardKeys.hod,
    queryFn: dashboardService.getHodDashboard,
  });
}
