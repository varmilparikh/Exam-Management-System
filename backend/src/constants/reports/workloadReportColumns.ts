import type { ReportColumn } from "../../types/report.js";

export interface FacultyWorkloadReportRow {
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  totalDuties: number;
  assignedCount: number;
  attendedCount: number;
  absentCount: number;
  transferCount: number;
}

export const workloadReportColumns = [
  {
    id: "employeeCode",
    title: "Employee Code",
    width: 75,
    align: "center",
  },
  {
    id: "name",
    title: "Faculty Name",
    width: 100,
  },
  {
    id: "email",
    title: "Email",
    width: 145,
  },
  {
    id: "department",
    title: "Department",
    width: 120,
  },
  {
    id: "totalDuties",
    title: "Total Duties",
    width: 65,
    align: "center",
  },
  {
    id: "assignedCount",
    title: "Assigned",
    width: 60,
    align: "center",
  },
  {
    id: "attendedCount",
    title: "Attended",
    width: 60,
    align: "center",
  },
  {
    id: "absentCount",
    title: "Absent",
    width: 55,
    align: "center",
  },
  {
    id: "transferCount",
    title: "Transferred",
    width: 70,
    align: "center",
  },
] satisfies ReportColumn<FacultyWorkloadReportRow>[];
