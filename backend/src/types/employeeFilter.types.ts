import type { Role } from "../generated/prisma/client.js";

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  role?: Role;
  status?: "ACTIVE" | "INACTIVE";
}
