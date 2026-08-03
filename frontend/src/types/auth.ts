import type { EmployeeResponseDto } from "../features/employees/types/employee";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  employee: EmployeeResponseDto;
}