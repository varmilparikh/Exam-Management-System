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