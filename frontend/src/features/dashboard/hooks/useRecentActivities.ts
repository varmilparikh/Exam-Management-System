import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "../queryKeys";
import { dashboardService } from "../api/dashboard.service";

export function useRecentActivities(limit = 10) {
  return useQuery({
    queryKey: [...dashboardKeys.recentActivities, limit],
    queryFn: () => dashboardService.getRecentActivities(limit),
  });
}
