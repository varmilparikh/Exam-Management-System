import type { ReportColumn } from "../../types/report.js";

export interface DutyReportExportRow {
  faculty: string;
  exam: string;
  examDate: string;
  department: string;
  status: string;
}

export const dutyReportColumns = [
  { id: "faculty", title: "Faculty", width: 145 },
  { id: "exam", title: "Exam", width: 180 },
  { id: "examDate", title: "Exam Date / Session", width: 180 },
  { id: "department", title: "Department", width: 150 },
  { id: "status", title: "Duty Status", width: 100 },
] satisfies ReportColumn<DutyReportExportRow>[];
