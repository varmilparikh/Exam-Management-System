import api from "@/lib/api";

import type { ApiResponse } from "@/types/api";

import type { Exam } from "../types/exam";

import type { ExamFilters } from "../types/examFilters";

export interface CreateExamDto {
  examName: string;
  examDate: string;
  requiredFaculty: number;
}

export interface UpdateExamDto {
  examName?: string;
  examDate?: string;
  requiredFaculty?: number;
  status?: Exam["status"];
}

const DEFAULT_FILTERS: ExamFilters = {
  search: "",
  status: "",
};

async function getAll(filters: ExamFilters = DEFAULT_FILTERS) {
  const response = await api.get<ApiResponse<Exam[]>>("/exams", {
    params: {
      search: filters.search || undefined,
      status: filters.status || undefined,
    },
  });

  return response.data.data;
}

async function getById(id: string) {
  const response = await api.get<ApiResponse<Exam>>(`/exams/${id}`);

  return response.data.data;
}

async function create(data: CreateExamDto) {
  const response = await api.post<ApiResponse<Exam>>("/exams", data);

  return response.data.data;
}

async function update(id: string, data: UpdateExamDto) {
  const response = await api.put<ApiResponse<Exam>>(`/exams/${id}`, data);

  return response.data.data;
}

async function remove(id: string) {
  const response = await api.delete<ApiResponse<Exam>>(`/exams/${id}`);

  return response.data.data;
}

export const examService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
