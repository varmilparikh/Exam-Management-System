import type { ReportColumn } from "./report.js";

export interface PDFReportOptions<T extends object> {
  title: string;
  subtitle?: string;
  generatedBy?: string;
  columns: ReportColumn<T>[];
  rows: T[];
}