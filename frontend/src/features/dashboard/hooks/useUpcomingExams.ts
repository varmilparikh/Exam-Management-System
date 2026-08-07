import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "../queryKeys";
import { dashboardService } from "../api/dashboard.service";

export function useUpcomingExams(limit = 5) {
  return useQuery({
    queryKey: [...dashboardKeys.upcomingExams, limit],
    queryFn: () => dashboardService.getUpcomingExams(limit),
  });
}
