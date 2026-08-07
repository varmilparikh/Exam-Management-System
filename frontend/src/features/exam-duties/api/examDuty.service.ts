import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";

import type { DutyStatus, ExamDuty } from "../types/examDuty";
import type { ExamDutyFilters } from "../types/examDutyFilters";

export interface CreateExamDutyDto {
  employeeId: string;
  examId: string;
}

const DEFAULT_FILTERS: ExamDutyFilters = {
  search: "",
  status: "",
};

async function getAll(
  filters: ExamDutyFilters = DEFAULT_FILTERS,
  page = 1,
  limit = 100,
) {
  const response = await api.get<ApiResponse<ExamDuty[]>>("/exam-duties", {
    params: {
      page,
      limit,
      search: filters.search || undefined,
      status: filters.status || undefined,
    },
  });

  return response.data.data;
}

async function getMyUpcomingDuties() {
  const response = await api.get<ApiResponse<ExamDuty[]>>(
    "/exam-duties/me/upcoming",
  );

  return response.data.data;
}

async function getFacultyUpcomingDuties(employeeId: string) {
  const response = await api.get<ApiResponse<ExamDuty[]>>(
    `/exam-duties/faculty/${employeeId}/upcoming`,
  );

  return response.data.data;
}

async function create(data: CreateExamDutyDto) {
  const response = await api.post<ApiResponse<ExamDuty>>("/exam-duties", data);

  return response.data.data;
}

async function updateStatus(id: string, status: DutyStatus) {
  const response = await api.put<ApiResponse<ExamDuty>>(`/exam-duties/${id}`, {
    status,
  });

  return response.data.data;
}

async function remove(id: string) {
  await api.delete(`/exam-duties/${id}`);
}

export const examDutyService = {
  getAll,
  getMyUpcomingDuties,
  getFacultyUpcomingDuties,
  create,
  updateStatus,
  remove,
};
