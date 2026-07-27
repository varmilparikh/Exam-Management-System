import type { EmployeeResponse } from "../constants/prismaSelect.js";

export function toEmployeeResponse(
  employee: EmployeeResponse,
): EmployeeResponse {
  return employee;
}