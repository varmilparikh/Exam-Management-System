import type { DepartmentResponse } from "../constants/prismaSelect.js";

export type DepartmentResponseDto = DepartmentResponse;

/**
 * Create Department DTO
 */
export interface CreateDepartmentDto {
  name: string;
}

/**
 * Update Department DTO
 */
export interface UpdateDepartmentDto {
  name?: string;
}
