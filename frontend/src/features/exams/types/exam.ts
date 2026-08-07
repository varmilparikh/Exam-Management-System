export interface Exam {
  id: string;

  examName: string;

  examDate: string;

  requiredFaculty: number;

  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

  createdAt: string;

  updatedAt: string;
}

export type ExamResponseDto = Exam;