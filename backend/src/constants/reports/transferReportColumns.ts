import type { ReportColumn } from "../../types/report.js";

export interface TransferReportRow {
  exam: string;
  examDate: string;
  requestType: string;
  fromEmployee: string;
  toEmployee: string;
  status: string;
  reason: string;
  approvedBy: string;
  approvedAt: string;
  createdAt: string;
}

export const transferReportColumns = [
  { id: "exam", title: "Exam", width: 130 },
  { id: "examDate", title: "Exam Date", width: 110 },
  { id: "requestType", title: "Request Type", width: 125 },
  { id: "fromEmployee", title: "From Employee", width: 115 },
  { id: "toEmployee", title: "To Employee", width: 115 },
  { id: "status", title: "Status", width: 85 },
  { id: "reason", title: "Reason", width: 150 },
  { id: "approvedBy", title: "Approved By", width: 115 },
  { id: "approvedAt", title: "Approved On", width: 135 },
  { id: "createdAt", title: "Requested On", width: 120 },
] satisfies ReportColumn<TransferReportRow>[];
