import type { EmployeeFilters } from "./types/employeeFilters";

export const employeeKeys = {
  all: ["employees"] as const,

  list: (filters: EmployeeFilters) => [...employeeKeys.all, filters] as const,

  detail: (id: string) => [...employeeKeys.all, id] as const,
};
