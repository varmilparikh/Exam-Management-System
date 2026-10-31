import reportsRepository from "../repositories/reports.repository.js";
import reportExportService from "./reportExport.service.js";

import { employeeReportColumns } from "../constants/reports/employeeReportColumns.js";

import type { EmployeeReportQuery } from "../validators/reports.validator.js";

import { mapEmployeeReportRows } from "../mappers/employeeReport.mapper.js";

import { pdfExportService } from "./exports/index.js";

import type { WorkloadReportQuery } from "../validators/workloadReport.validator.js";

import { workloadReportColumns } from "../constants/reports/workloadReportColumns.js";
import { examReportColumns } from "../constants/reports/examReportColumns.js";
import { transferReportColumns } from "../constants/reports/transferReportColumns.js";
import { swapReportColumns } from "../constants/reports/swapReportColumns.js";
import { dutyReportColumns } from "../constants/reports/dutyReportColumns.js";
import { activityReportColumns } from "../constants/reports/activityReportColumns.js";
import type { ExamReportQuery } from "../validators/examReport.validator.js";
import type { TransferReportQuery } from "../validators/transferReport.validator.js";
import type { SwapReportQuery } from "../validators/swapReport.validator.js";
import type { DutyReportQuery } from "../validators/dutyReport.validator.js";
import type { ActivityReportQuery } from "../validators/activityReport.validator.js";

const formatDateTime = (value: Date | null): string =>
  value?.toISOString() ?? "";

const EXPORT_PAGE_SIZE = 100;

async function collectAllPages<T>(
  loadPage: (page: number, limit: number) => Promise<{ items: T[]; totalPages: number }>,
): Promise<T[]> {
  const rows: T[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const result = await loadPage(page, EXPORT_PAGE_SIZE);
    rows.push(...result.items);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);
  return rows;
}

class ReportsService {
  async getReportsOverview() {
    return reportsRepository.getReportsOverview();
  }

  async getEmployeeReport(filters: EmployeeReportQuery) {
    return reportsRepository.getEmployeeReport(filters);
  }

  async exportEmployeeCSV(filters: EmployeeReportQuery) {
    const rows = await this.getAllEmployeeRows(filters);

    return reportExportService.generateCSV(mapEmployeeReportRows(rows), employeeReportColumns);
  }

  async exportEmployeeExcel(filters: EmployeeReportQuery) {
    const employees = await this.getAllEmployeeRows(filters);
    const rows = mapEmployeeReportRows(employees);

    return reportExportService.generateExcel(
      rows,
      employeeReportColumns,
      "Employees",
    );
  }

  async exportEmployeePDF(filters: EmployeeReportQuery) {
    const employees = await this.getAllEmployeeRows(filters);
    const rows = mapEmployeeReportRows(employees);

    return pdfExportService.generatePDF({
      title: "Employee Report",
      subtitle: "Faculty Details",
      generatedBy: "Controller of Examination",
      columns: employeeReportColumns,
      rows,
    });
  }

  async getFacultyWorkloadReport(filters: WorkloadReportQuery) {
    return reportsRepository.getFacultyWorkloadReport(filters);
  }

  async getExamReport(filters: ExamReportQuery) {
    const report = await reportsRepository.getExamReport(filters);
    return {
      ...report,
      rows: report.rows.map((row) => ({
        ...row,
        examDate: formatDateTime(row.examDate),
        startTime: formatDateTime(row.startTime),
        endTime: formatDateTime(row.endTime),
        createdAt: formatDateTime(row.createdAt),
      })),
    };
  }

  async getDutyReport(filters: DutyReportQuery) {
    const report = await reportsRepository.getDutyReport(filters);
    return {
      ...report,
      rows: report.rows.map((row) => ({
        id: row.id,
        faculty: row.employee?.name ?? "Unassigned",
        exam: row.exam.examName,
        examDate: formatDateTime(row.exam.examDate),
        sessionName: row.exam.sessionName,
        startTime: formatDateTime(row.exam.startTime),
        endTime: formatDateTime(row.exam.endTime),
        department: row.employee?.department?.name ?? "—",
        status: row.status,
      })),
    };
  }

  async getActivityReport(filters: ActivityReportQuery) {
    const report = await reportsRepository.getActivityReport(filters);
    return {
      ...report,
      rows: report.rows.map((row) => ({
        id: row.id,
        user: row.employee.name,
        action: row.action,
        description: row.description,
        entity: `${row.entityType}${row.entityId ? ` · ${row.entityId}` : ""}`,
        timestamp: formatDateTime(row.createdAt),
      })),
    };
  }

  async getTransferReport(filters: TransferReportQuery) {
    const report = await reportsRepository.getTransferReport(filters);
    return {
      ...report,
      rows: report.rows.map((row) => ({
        id: row.id,
        exam: row.examDuty.exam.examName,
        examDate: formatDateTime(row.examDuty.exam.examDate),
        fromEmployee: row.fromEmployee.name,
        toEmployee: row.toEmployee?.name ?? "Replacement needed",
        requestType: row.requestType,
        status: row.status,
        reason: row.reason ?? "",
        approvedBy: row.approvedBy?.name ?? "—",
        approvedAt: formatDateTime(row.approvedAt),
        createdAt: formatDateTime(row.createdAt),
      })),
    };
  }

  async getSwapReport(filters: SwapReportQuery) {
    const report = await reportsRepository.getSwapReport(filters);
    return {
      ...report,
      rows: report.rows.map((row) => ({
        id: row.id,
        exam: `${row.requesterDuty.exam.examName} ↔ ${row.receiverDuty.exam.examName}`,
        requesterDuty: `${row.requesterDuty.exam.examName} (${formatDateTime(row.requesterDuty.exam.examDate)})`,
        receiverDuty: `${row.receiverDuty.exam.examName} (${formatDateTime(row.receiverDuty.exam.examDate)})`,
        requester: row.requester.name,
        receiver: row.receiver.name,
        status: row.status,
        reason: row.reason ?? "",
        completedAt: formatDateTime(row.completedAt),
        createdAt: formatDateTime(row.createdAt),
      })),
    };
  }

  async exportExamCSV(filters: ExamReportQuery) {
    const rows = await this.getAllExamRows(filters);
    return reportExportService.generateCSV(rows, examReportColumns);
  }

  async exportExamExcel(filters: ExamReportQuery) {
    const rows = await this.getAllExamRows(filters);
    return reportExportService.generateExcel(rows, examReportColumns, "Exams");
  }

  async exportExamPDF(filters: ExamReportQuery) {
    const rows = await this.getAllExamRows(filters);
    return pdfExportService.generatePDF({
      title: "Examination Report",
      generatedBy: "Controller of Examination",
      columns: examReportColumns,
      rows,
    });
  }

  async exportTransferCSV(filters: TransferReportQuery) {
    const rows = await this.getAllTransferRows(filters);
    return reportExportService.generateCSV(rows, transferReportColumns);
  }

  async exportTransferExcel(filters: TransferReportQuery) {
    const rows = await this.getAllTransferRows(filters);
    return reportExportService.generateExcel(
      rows,
      transferReportColumns,
      "Transfers",
    );
  }

  async exportTransferPDF(filters: TransferReportQuery) {
    const rows = await this.getAllTransferRows(filters);
    return pdfExportService.generatePDF({
      title: "Transfer Request Report",
      generatedBy: "Controller of Examination",
      columns: transferReportColumns,
      rows,
    });
  }

  async exportSwapCSV(filters: SwapReportQuery) {
    const rows = await this.getAllSwapRows(filters);
    return reportExportService.generateCSV(rows, swapReportColumns);
  }

  async exportSwapExcel(filters: SwapReportQuery) {
    const rows = await this.getAllSwapRows(filters);
    return reportExportService.generateExcel(rows, swapReportColumns, "Swaps");
  }

  async exportSwapPDF(filters: SwapReportQuery) {
    const rows = await this.getAllSwapRows(filters);
    return pdfExportService.generatePDF({
      title: "Swap Request Report",
      generatedBy: "Controller of Examination",
      columns: swapReportColumns,
      rows,
    });
  }

  async exportFacultyWorkloadCSV(filters: WorkloadReportQuery) {
    const rows = await this.getAllFacultyWorkloadRows(filters);

    return reportExportService.generateCSV(rows, workloadReportColumns);
  }

  async exportFacultyWorkloadExcel(filters: WorkloadReportQuery) {
    const rows = await this.getAllFacultyWorkloadRows(filters);

    return reportExportService.generateExcel(
      rows,
      workloadReportColumns,
      "Faculty Workload",
    );
  }

  async exportFacultyWorkloadPDF(filters: WorkloadReportQuery) {
    const rows = await this.getAllFacultyWorkloadRows(filters);

    return pdfExportService.generatePDF({
      title: "Faculty Workload Report",
      subtitle: "Faculty Duty Workload",
      generatedBy: "Controller of Examination",
      columns: workloadReportColumns,
      rows,
    });
  }

  async exportDutyReport(filters: DutyReportQuery, format: "csv" | "excel" | "pdf") {
    const rows = await collectAllPages(async (page, limit) => {
      const report = await reportsRepository.getDutyReport({ ...filters, page, limit });
      return { items: report.rows, totalPages: report.pagination.totalPages };
    });
    const exportRows = rows.map((row) => ({
      faculty: row.employee?.name ?? "Unassigned",
      exam: row.exam.examName,
      examDate: `${formatDateTime(row.exam.examDate)} · ${row.exam.sessionName} ${formatDateTime(row.exam.startTime)}–${formatDateTime(row.exam.endTime)}`,
      department: row.employee?.department?.name ?? "—",
      status: row.status,
    }));
    if (format === "csv") return reportExportService.generateCSV(exportRows, dutyReportColumns);
    if (format === "excel") return reportExportService.generateExcel(exportRows, dutyReportColumns, "Duties");
    return pdfExportService.generatePDF({ title: "Exam Duty Report", generatedBy: "Controller of Examination", columns: dutyReportColumns, rows: exportRows });
  }

  async exportActivityReport(filters: ActivityReportQuery, format: "csv" | "excel" | "pdf") {
    const rows = await collectAllPages(async (page, limit) => {
      const report = await reportsRepository.getActivityReport({ ...filters, page, limit });
      return { items: report.rows, totalPages: report.pagination.totalPages };
    });
    const exportRows = rows.map((row) => ({
      user: row.employee.name,
      action: row.action,
      description: row.description,
      entity: `${row.entityType}${row.entityId ? ` · ${row.entityId}` : ""}`,
      timestamp: formatDateTime(row.createdAt),
    }));
    if (format === "csv") return reportExportService.generateCSV(exportRows, activityReportColumns);
    if (format === "excel") return reportExportService.generateExcel(exportRows, activityReportColumns, "Activity");
    return pdfExportService.generatePDF({ title: "Activity Report", generatedBy: "Controller of Examination", columns: activityReportColumns, rows: exportRows });
  }

  private async getAllFacultyWorkloadRows(filters: WorkloadReportQuery) {
    return collectAllPages(async (page, limit) => {
      const report = await reportsRepository.getFacultyWorkloadReport({ ...filters, page, limit });
      return { items: report.rows, totalPages: report.pagination.totalPages };
    });
  }

  private async getAllEmployeeRows(filters: EmployeeReportQuery) {
    return collectAllPages(async (page, limit) => {
      const report = await reportsRepository.getEmployeeReport({ ...filters, page, limit });
      return { items: report.employees, totalPages: report.pagination.totalPages };
    });
  }

  private async getAllExamRows(filters: ExamReportQuery) {
    const rows = await collectAllPages(async (page, limit) => {
      const report = await reportsRepository.getExamReport({ ...filters, page, limit });
      return { items: report.rows, totalPages: report.pagination.totalPages };
    });
    return rows.map((row) => ({
      examName: row.examName,
      examDate: formatDateTime(row.examDate),
      session: `${row.sessionName} ${formatDateTime(row.startTime)}–${formatDateTime(row.endTime)}`,
      requiredFaculty: row.requiredFaculty,
      assignedFaculty: row.assignedFaculty,
      remainingPositions: row.remainingPositions,
      status: row.status,
      createdAt: formatDateTime(row.createdAt),
    }));
  }

  private async getAllTransferRows(filters: TransferReportQuery) {
    const rows = await collectAllPages(async (page, limit) => {
      const report = await reportsRepository.getTransferReport({ ...filters, page, limit });
      return { items: report.rows, totalPages: report.pagination.totalPages };
    });
    return rows.map((row) => ({
      exam: row.examDuty.exam.examName,
      examDate: formatDateTime(row.examDuty.exam.examDate),
      requestType: row.requestType,
      fromEmployee: row.fromEmployee.name,
      toEmployee: row.toEmployee?.name ?? "Replacement needed",
      status: row.status,
      reason: row.reason ?? "",
      approvedBy: row.approvedBy?.name ?? "—",
      approvedAt: formatDateTime(row.approvedAt),
      createdAt: formatDateTime(row.createdAt),
    }));
  }

  private async getAllSwapRows(filters: SwapReportQuery) {
    const rows = await collectAllPages(async (page, limit) => {
      const report = await reportsRepository.getSwapReport({ ...filters, page, limit });
      return { items: report.rows, totalPages: report.pagination.totalPages };
    });
    return rows.map((row) => ({
      exam: `${row.requesterDuty.exam.examName} ↔ ${row.receiverDuty.exam.examName}`,
      requesterDuty: `${row.requesterDuty.exam.examName} (${formatDateTime(row.requesterDuty.exam.examDate)})`,
      receiverDuty: `${row.receiverDuty.exam.examName} (${formatDateTime(row.receiverDuty.exam.examDate)})`,
      requester: row.requester.name,
      receiver: row.receiver.name,
      status: row.status,
      reason: row.reason ?? "",
      completedAt: formatDateTime(row.completedAt),
      createdAt: formatDateTime(row.createdAt),
    }));
  }
}

export default new ReportsService();
