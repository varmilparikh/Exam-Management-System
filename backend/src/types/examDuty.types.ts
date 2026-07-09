import type { DutyStatus } from "../generated/prisma/client.js";

/**
 * Create Exam Duty DTO
 */
export interface CreateExamDutyDto {
  employeeId: string;
  examId: string;
}

/**
 * Update Exam Duty DTO
 */
export interface UpdateExamDutyDto {
  employeeId?: string;
  examId?: string;
  status?: DutyStatus;
}