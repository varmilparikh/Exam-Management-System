export interface CoeDashboardDto {
  totalEmployees: number;
  totalDepartments: number;
  totalUpcomingExams: number;
  completedExams: number;
  todayExams: number;
  assignedDuties: number;
  pendingTransferRequests: number;
  pendingSwapRequests: number;
  totalNotifications: number;
  totalActivityLogs: number;
}

export interface FacultyDashboardDto {
  myUpcomingDuties: number;
  completedDuties: number;
  pendingTransferRequests: number;
  pendingSwapRequests: number;
  unreadNotifications: number;
}

export interface HodDashboardDto {
  totalFaculty: number;
  upcomingDepartmentDuties: number;
  pendingTransferRequests: number;
  pendingSwapRequests: number;
}