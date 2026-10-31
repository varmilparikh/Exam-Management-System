import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { ActivityLogFilters, ActivityLogResponse } from "../types/activityLog";

export async function getActivityLogs(filters: ActivityLogFilters) {
  const response = await api.get<ApiResponse<ActivityLogResponse>>(
    "/activity-logs",
    {
      params: {
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        action: filters.action || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
      },
    },
  );
  return response.data.data;
}
