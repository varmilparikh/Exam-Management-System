import reportsRepository from "../repositories/reports.repository.js";
import reportExportService from "./reportExport.service.js";

import { employeeReportColumns } from "../constants/reports/employeeReportColumns.js";

import type { EmployeeReportQuery } from "../validators/reports.validator.js";

import { mapEmployeeReportRows } from "../mappers/employeeReport.mapper.js";

import { pdfExportService } from "./exports/index.js";

class ReportsService {
  async getEmployeeReport(filters: EmployeeReportQuery) {
    return reportsRepository.getEmployeeReport(filters);
  }

  async exportEmployeeCSV(filters: EmployeeReportQuery) {
    const report = await reportsRepository.getEmployeeReport(filters);

    const rows = mapEmployeeReportRows(report.employees);

    return reportExportService.generateCSV(rows, employeeReportColumns);
  }

  async exportEmployeeExcel(filters: EmployeeReportQuery) {
    const report = await reportsRepository.getEmployeeReport(filters);

    const rows = mapEmployeeReportRows(report.employees);

    return reportExportService.generateExcel(
      rows,
      employeeReportColumns,
      "Employees",
    );
  }

  async exportEmployeePDF(
  filters: EmployeeReportQuery,
) {
  const report =
    await reportsRepository.getEmployeeReport(filters);

  const rows =
    mapEmployeeReportRows(report.employees);

  return pdfExportService.generatePDF({
    title: "Employee Report",
    subtitle: "Faculty Details",
    generatedBy: "Controller of Examination",
    columns: employeeReportColumns,
    rows,
  });
}
}

export default new ReportsService();
