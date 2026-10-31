import { useQuery } from "@tanstack/react-query";

import { reportsService } from "../api/reports.service";
import type { EmployeeReportFilters } from "../types/report";

export const reportKeys = {
  all: ["reports"] as const,
  employees: (filters: EmployeeReportFilters) =>
    [...reportKeys.all, "employees", filters] as const,
};

export function useEmployeeReport(filters: EmployeeReportFilters) {
  return useQuery({
    queryKey: reportKeys.employees(filters),
    queryFn: () => reportsService.getEmployeeReport(filters),
  });
}
