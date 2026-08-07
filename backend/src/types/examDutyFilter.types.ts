import type { DutyStatus } from "../generated/prisma/client.js";

export interface ExamDutyFilters {
  examId?: string;
  employeeId?: string;
  search?: string;
  status?: DutyStatus;
}
