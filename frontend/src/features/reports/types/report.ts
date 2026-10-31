export interface EmployeeReportEmployee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  designation: string;
  role: string;
  isActive: boolean;
  attendedCount: number;
  transferCount: number;
  averageDuty: number;
  department: {
    id: string;
    name: string;
  };
}

export interface EmployeeReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EmployeeReportResponse {
  employees: EmployeeReportEmployee[];
  pagination: EmployeeReportPagination;
}

export interface EmployeeReportFilters {
  page: number;
  limit: number;
  search: string;
  departmentId: string;
  role: string;
  isActive: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface FacultyWorkloadRow {
  employeeId: string;
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

export interface FacultyWorkloadSummary {
  totalFaculty: number;
  totalDuties: number;
  totalAssigned: number;
  totalAttended: number;
  totalAbsent: number;
  totalTransferred: number;
  averageDutiesPerFaculty: number;
}

export interface FacultyWorkloadResponse {
  rows: FacultyWorkloadRow[];
  summary: FacultyWorkloadSummary;
  pagination: EmployeeReportPagination;
}

export interface FacultyWorkloadFilters {
  page: number;
  limit: number;
  search: string;
  departmentId: string;
  facultyId: string;
  fromDate: string;
  toDate: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface StatusReportFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  fromDate: string;
  toDate: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface StatusReportSummary {
  total: number;
  statusCounts: Record<string, number>;
}

export interface ExamReportRow {
  id: string;
  examName: string;
  examDate: string;
  requiredFaculty: number;
  assignedFaculty: number;
  remainingPositions: number;
  sessionName: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

export interface ExamReportResponse {
  rows: ExamReportRow[];
  summary: StatusReportSummary;
  pagination: EmployeeReportPagination;
}

export interface TransferReportRow {
  id: string;
  exam: string;
  examDate: string;
  requestType: "REPLACEMENT_FOUND" | "NEEDS_ASSISTANCE";
  fromEmployee: string;
  toEmployee: string;
  status: string;
  reason: string;
  approvedBy: string;
  approvedAt: string;
  createdAt: string;
}

export interface SwapReportRow {
  id: string;
  exam: string;
  requester: string;
  receiver: string;
  requesterDuty: string;
  receiverDuty: string;
  status: string;
  reason: string;
  completedAt: string;
  createdAt: string;
}

export interface TransferReportResponse {
  rows: TransferReportRow[];
  summary: StatusReportSummary;
  pagination: EmployeeReportPagination;
}

export interface SwapReportResponse {
  rows: SwapReportRow[];
  summary: StatusReportSummary;
  pagination: EmployeeReportPagination;
}

export interface DutyReportRow {
  id: string;
  faculty: string;
  exam: string;
  examDate: string;
  sessionName: string;
  startTime: string;
  endTime: string;
  department: string;
  status: string;
}

export interface DutyReportResponse {
  rows: DutyReportRow[];
  summary: StatusReportSummary;
  pagination: EmployeeReportPagination;
}

export interface ActivityReportRow {
  id: string;
  user: string;
  action: string;
  description: string;
  entity: string;
  timestamp: string;
}

export interface ActivityReportResponse {
  rows: ActivityReportRow[];
  summary: { total: number; actionCounts: Record<string, number> };
  pagination: EmployeeReportPagination;
}

export interface ReportsOverview {
  employees: number;
  activeExams: number;
  upcomingExams: number;
  duties: number;
  pendingTransfers: number;
  transfers: number;
  pendingSwaps: number;
  completedSwaps: number;
  activityLogs: number;
  pendingOptIns: number;
  confirmedOptIns: number;
}
