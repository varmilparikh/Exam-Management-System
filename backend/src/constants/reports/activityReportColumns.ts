import type { ReportColumn } from "../../types/report.js";

export interface ActivityReportExportRow {
  user: string;
  action: string;
  description: string;
  entity: string;
  timestamp: string;
}

export const activityReportColumns = [
  { id: "user", title: "User", width: 125 },
  { id: "action", title: "Action", width: 150 },
  { id: "description", title: "Description", width: 230 },
  { id: "entity", title: "Entity", width: 130 },
  { id: "timestamp", title: "Timestamp", width: 150 },
] satisfies ReportColumn<ActivityReportExportRow>[];
