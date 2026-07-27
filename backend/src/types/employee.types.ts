import type { EmployeeResponse } from "../constants/prismaSelect.js";
import type { Role } from "../generated/prisma/client.js";

export type EmployeeResponseDto = EmployeeResponse;

/**
 * Create Employee DTO
 */
export interface CreateEmployeeDto {
  employeeCode: string;
  name: string;
  email: string;
  password: string;
  designation: string;
  departmentId: string;
  role: Role;
  phone?: string;
}

/**
 * Update Employee DTO
 */
export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  employeeCode?: string;
  designation?: string;
  departmentId?: string;
  role?: Role;
  phone?: string;
  isActive?: boolean;
}
