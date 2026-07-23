import type { ExamResponse } from "../constants/prismaSelect.js";

export type ExamResponseDto = ExamResponse;

/**
 * Create Exam DTO
 */
export interface CreateExamDto {
  examName: string;
  examDate: Date;
  requiredFaculty: number;
}

/**
 * Update Exam DTO
 */
export interface UpdateExamDto {
  examName?: string;
  examDate?: Date;
  requiredFaculty?: number;
}