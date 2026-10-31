import type { ReportColumn } from "../../types/report.js";

export interface ExamReportRow {
  examName: string;
  examDate: string;
  requiredFaculty: number;
  assignedFaculty: number;
  remainingPositions: number;
  session: string;
  status: string;
  createdAt: string;
}

export const examReportColumns = [
  { id: "examName", title: "Exam Name", width: 180 },
  { id: "examDate", title: "Exam Date", width: 100 },
  { id: "requiredFaculty", title: "Required Faculty", width: 95, align: "center" },
  { id: "assignedFaculty", title: "Assigned Faculty", width: 95, align: "center" },
  { id: "remainingPositions", title: "Remaining Positions", width: 95, align: "center" },
  { id: "session", title: "Session", width: 140 },
  { id: "status", title: "Status", width: 95, align: "center" },
  { id: "createdAt", title: "Created At", width: 135 },
] satisfies ReportColumn<ExamReportRow>[];
