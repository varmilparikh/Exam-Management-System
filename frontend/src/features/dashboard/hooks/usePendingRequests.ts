import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "../queryKeys";
import { dashboardService } from "../api/dashboard.service";

export function usePendingRequests(limit = 5) {
  return useQuery({
    queryKey: [...dashboardKeys.DashboardPendingRequests, limit],
    queryFn: () => dashboardService.getPendingRequests(limit),
  });
}
