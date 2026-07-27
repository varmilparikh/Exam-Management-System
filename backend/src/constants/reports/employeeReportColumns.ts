import type { ReportColumn } from "../../types/report.js";

export interface EmployeeReportRow {
  employeeCode: string;
  name: string;
  email: string;
  designation: string;
  role: string;
  department: string;
  attendedCount: number;
  transferCount: number;
  averageDuty: number;
  isActive: string;
}

export const employeeReportColumns = [
  {
    id: "employeeCode",
    title: "Employee Code",
    width: 70,
    align: "center",
  },
  {
    id: "name",
    title: "Employee Name",
    width: 95,
  },
  {
    id: "email",
    title: "Email",
    width: 150,
  },
  {
    id: "designation",
    title: "Designation",
    width: 100,
  },
  {
    id: "role",
    title: "Role",
    width: 70,
    align: "center",
  },
  {
    id: "department",
    title: "Department",
    width: 110,
  },
  {
    id: "attendedCount",
    title: "Attended",
    width: 55,
    align: "center",
  },
  {
    id: "transferCount",
    title: "Transfers",
    width: 55,
    align: "center",
  },
  {
    id: "averageDuty",
    title: "Average",
    width: 55,
    align: "center",
  },
  {
    id: "isActive",
    title: "Status",
    width: 60,
    align: "center",
  },
] satisfies ReportColumn<EmployeeReportRow>[];
