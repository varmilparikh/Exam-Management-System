import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";

import type {
  CoeDashboard,
  FacultyDashboard,
  HodDashboard,
  DashboardPendingRequests,
  RecentActivity,
  UpcomingExam,
  FacultyWorkload,
} from "../types";

async function getCoeDashboard() {
  const response = await api.get<ApiResponse<CoeDashboard>>("/dashboard/coe");

  return response.data.data;
}

async function getFacultyDashboard() {
  const response =
    await api.get<ApiResponse<FacultyDashboard>>("/dashboard/faculty");

  return response.data.data;
}

async function getHodDashboard() {
  const response = await api.get<ApiResponse<HodDashboard>>("/dashboard/hod");

  return response.data.data;
}

async function getUpcomingExams(limit = 5) {
  const response = await api.get<ApiResponse<UpcomingExam[]>>(
    `/dashboard/upcoming-exams?limit=${limit}`,
  );

  return response.data.data;
}

async function getRecentActivities(limit = 10) {
  const response = await api.get<ApiResponse<RecentActivity[]>>(
    `/dashboard/recent-activities?limit=${limit}`,
  );

  return response.data.data;
}

async function getPendingRequests(limit = 5) {
  const response = await api.get<ApiResponse<DashboardPendingRequests>>(
    `/dashboard/pending-requests?limit=${limit}`,
  );

  return response.data.data;
}

async function getFacultyWorkload(limit = 10) {
  const response = await api.get<ApiResponse<FacultyWorkload[]>>(
    `/dashboard/faculty-workload?limit=${limit}`,
  );

  return response.data.data;
}

export const dashboardService = {
  getCoeDashboard,
  getFacultyDashboard,
  getHodDashboard,
  getUpcomingExams,
  getRecentActivities,
  getPendingRequests,
  getFacultyWorkload,
};
