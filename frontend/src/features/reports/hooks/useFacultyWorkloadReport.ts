import { useQuery } from "@tanstack/react-query";
import { reportsService } from "../api/reports.service";
import type { FacultyWorkloadFilters } from "../types/report";

export function useFacultyWorkloadReport(filters: FacultyWorkloadFilters) {
  return useQuery({
    queryKey: ["reports", "faculty-workload", filters],
    queryFn: () => reportsService.getFacultyWorkloadReport(filters),
  });
}
