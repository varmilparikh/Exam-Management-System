import type { EmployeeResponseDto } from "./employee.types.js";

export interface LoginResult {
  employee: EmployeeResponseDto;
  accessToken: string;
  refreshToken: string;
}
export interface RegisterUserDto {
  employeeCode: string;
  name: string;
  email: string;
  password: string;
  designation: string;
  departmentId: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}
