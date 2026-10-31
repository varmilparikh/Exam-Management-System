import type { ReportColumn } from "../../types/report.js";

export interface SwapReportRow {
  exam: string;
  requesterDuty: string;
  receiverDuty: string;
  requester: string;
  receiver: string;
  status: string;
  reason: string;
  completedAt: string;
  createdAt: string;
}

export const swapReportColumns = [
  { id: "exam", title: "Exam", width: 130 },
  { id: "requesterDuty", title: "Requester Duty", width: 145 },
  { id: "receiverDuty", title: "Receiver Duty", width: 145 },
  { id: "requester", title: "Requester", width: 115 },
  { id: "receiver", title: "Receiver", width: 115 },
  { id: "status", title: "Status", width: 85 },
  { id: "reason", title: "Reason", width: 150 },
  { id: "completedAt", title: "Completed On", width: 135 },
  { id: "createdAt", title: "Requested On", width: 120 },
] satisfies ReportColumn<SwapReportRow>[];
