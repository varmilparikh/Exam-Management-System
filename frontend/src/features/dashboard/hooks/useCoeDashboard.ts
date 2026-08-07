import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "../queryKeys";
import { dashboardService } from "../api/dashboard.service";

export function useCoeDashboard() {
  return useQuery({
    queryKey: dashboardKeys.coe,
    queryFn: dashboardService.getCoeDashboard,
  });
}
