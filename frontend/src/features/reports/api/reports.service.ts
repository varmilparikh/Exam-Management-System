import api from "@/lib/axios";

import type { ApiResponse } from "@/types";
import type {
  EmployeeReportFilters,
  EmployeeReportResponse,
  FacultyWorkloadFilters,
  FacultyWorkloadResponse,
  ExamReportResponse,
  StatusReportFilters,
  TransferReportResponse,
  SwapReportResponse,
  DutyReportResponse,
  ActivityReportResponse,
  ReportsOverview,
} from "../types/report";

function buildParams(filters: EmployeeReportFilters) {
  return {
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    departmentId: filters.departmentId || undefined,
    role: filters.role || undefined,
    isActive: filters.isActive === "" ? undefined : filters.isActive === "true",
    sortBy: filters.sortBy || undefined,
    sortOrder: filters.sortOrder || undefined,
  };
}

function buildWorkloadParams(filters: FacultyWorkloadFilters) {
  return {
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    departmentId: filters.departmentId || undefined,
    facultyId: filters.facultyId || undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
    sortBy: filters.sortBy || undefined,
    sortOrder: filters.sortOrder,
  };
}

function buildStatusReportParams(filters: StatusReportFilters) {
  return {
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    status: filters.status || undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
    sortBy: filters.sortBy || undefined,
    sortOrder: filters.sortOrder,
  };
}

export async function getEmployeeReport(
  filters: EmployeeReportFilters,
): Promise<EmployeeReportResponse> {
  const response = await api.get<ApiResponse<EmployeeReportResponse>>(
    "/reports/employees",
    {
      params: buildParams(filters),
    },
  );

  return response.data.data;
}

export async function exportEmployeeCSV(
  filters: EmployeeReportFilters,
): Promise<Blob> {
  const response = await api.get("/reports/employees/export/csv", {
    params: buildParams(filters),
    responseType: "blob",
  });

  return response.data;
}

export async function exportEmployeeExcel(
  filters: EmployeeReportFilters,
): Promise<Blob> {
  const response = await api.get("/reports/employees/export/excel", {
    params: buildParams(filters),
    responseType: "blob",
  });

  return response.data;
}

export async function exportEmployeePDF(
  filters: EmployeeReportFilters,
): Promise<Blob> {
  const response = await api.get("/reports/employees/export/pdf", {
    params: buildParams(filters),
    responseType: "blob",
  });

  return response.data;
}

export async function getFacultyWorkloadReport(
  filters: FacultyWorkloadFilters,
): Promise<FacultyWorkloadResponse> {
  const response = await api.get<ApiResponse<FacultyWorkloadResponse>>(
    "/reports/workload",
    { params: buildWorkloadParams(filters) },
  );

  return response.data.data;
}

async function exportFacultyWorkload(
  filters: FacultyWorkloadFilters,
  format: "csv" | "excel" | "pdf",
): Promise<Blob> {
  const response = await api.get(`/reports/workload/export/${format}`, {
    params: buildWorkloadParams(filters),
    responseType: "blob",
  });

  return response.data;
}

export const exportFacultyWorkloadCSV = (filters: FacultyWorkloadFilters) =>
  exportFacultyWorkload(filters, "csv");

export const exportFacultyWorkloadExcel = (filters: FacultyWorkloadFilters) =>
  exportFacultyWorkload(filters, "excel");

export const exportFacultyWorkloadPDF = (filters: FacultyWorkloadFilters) =>
  exportFacultyWorkload(filters, "pdf");

async function getStatusReport<T>(
  endpoint: string,
  filters: StatusReportFilters,
): Promise<T> {
  const response = await api.get<ApiResponse<T>>(endpoint, {
    params: buildStatusReportParams(filters),
  });
  return response.data.data;
}

async function exportStatusReport(
  kind: "exams" | "transfers" | "swaps",
  filters: StatusReportFilters,
  format: "csv" | "excel" | "pdf",
): Promise<Blob> {
  const response = await api.get(`/reports/${kind}/export/${format}`, {
    params: buildStatusReportParams(filters),
    responseType: "blob",
  });
  return response.data;
}

export const getExamReport = (filters: StatusReportFilters) =>
  getStatusReport<ExamReportResponse>("/reports/exams", filters);

export const getTransferReport = (filters: StatusReportFilters) =>
  getStatusReport<TransferReportResponse>("/reports/transfers", filters);

export const getSwapReport = (filters: StatusReportFilters) =>
  getStatusReport<SwapReportResponse>("/reports/swaps", filters);

export const getDutyReport = (filters: StatusReportFilters) =>
  getStatusReport<DutyReportResponse>("/reports/duties", filters);

export const getActivityReport = (filters: StatusReportFilters & { action?: string }) => {
  const response = api.get<ApiResponse<ActivityReportResponse>>("/reports/activity", {
    params: { ...buildStatusReportParams(filters), action: filters.action || undefined },
  });
  return response.then((result) => result.data.data);
};

export async function getReportsOverview(): Promise<ReportsOverview> {
  const response = await api.get<ApiResponse<ReportsOverview>>("/reports/overview");
  return response.data.data;
}

export const exportExamReport = (
  filters: StatusReportFilters,
  format: "csv" | "excel" | "pdf",
) => exportStatusReport("exams", filters, format);

export const exportTransferReport = (
  filters: StatusReportFilters,
  format: "csv" | "excel" | "pdf",
) => exportStatusReport("transfers", filters, format);

export const exportSwapReport = (
  filters: StatusReportFilters,
  format: "csv" | "excel" | "pdf",
) => exportStatusReport("swaps", filters, format);

async function exportScopedReport(
  kind: "duties" | "activity",
  filters: StatusReportFilters & { action?: string },
  format: "csv" | "excel" | "pdf",
): Promise<Blob> {
  const response = await api.get(`/reports/${kind}/export/${format}`, {
    params: { ...buildStatusReportParams(filters), action: filters.action || undefined },
    responseType: "blob",
  });
  return response.data;
}

export const exportDutyReport = (filters: StatusReportFilters, format: "csv" | "excel" | "pdf") =>
  exportScopedReport("duties", filters, format);
export const exportActivityReport = (filters: StatusReportFilters & { action?: string }, format: "csv" | "excel" | "pdf") =>
  exportScopedReport("activity", filters, format);

export const reportsService = {
  getEmployeeReport,
  exportEmployeeCSV,
  exportEmployeeExcel,
  exportEmployeePDF,
  getFacultyWorkloadReport,
  exportFacultyWorkloadCSV,
  exportFacultyWorkloadExcel,
  exportFacultyWorkloadPDF,
  getExamReport,
  getTransferReport,
  getSwapReport,
  getDutyReport,
  getActivityReport,
  getReportsOverview,
  exportDutyReport,
  exportActivityReport,
  exportExamReport,
  exportTransferReport,
  exportSwapReport,
};
