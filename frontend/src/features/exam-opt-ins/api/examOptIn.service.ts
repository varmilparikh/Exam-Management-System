import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { ExamOptIn, ExamOptInStatus, UpcomingExamOptIn } from "../types";

async function getUpcoming() {
  const response = await api.get<ApiResponse<UpcomingExamOptIn[]>>("/exam-opt-ins/upcoming");
  return response.data.data;
}

async function optIn(examId: string) {
  const response = await api.post<ApiResponse<ExamOptIn>>("/exam-opt-ins", { examId });
  return response.data.data;
}

async function cancel(id: string) {
  const response = await api.patch<ApiResponse<ExamOptIn>>(`/exam-opt-ins/${id}/cancel`);
  return response.data.data;
}

async function getAll(filters: { status?: ExamOptInStatus }) {
  const response = await api.get<ApiResponse<ExamOptIn[]>>("/exam-opt-ins", { params: filters });
  return response.data.data;
}

async function review(id: string, action: "confirm" | "reject", remark?: string) {
  const response = await api.patch<ApiResponse<ExamOptIn>>(`/exam-opt-ins/${id}/${action}`, { remark });
  return response.data.data;
}

export const examOptInService = { getUpcoming, optIn, cancel, getAll, review };
