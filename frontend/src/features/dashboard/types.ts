import type { Exam } from "@/features/exams/types/exam";
import type { TransferRequest } from "@/features/transfer-requests/types/transferRequest";
import type { SwapRequest } from "@/features/swap-requests/types/swapRequest";

export interface CoeDashboard {
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

export interface FacultyDashboard {
  myUpcomingDuties: number;
  completedDuties: number;
  pendingTransferRequests: number;
  pendingSwapRequests: number;
  unreadNotifications: number;
}

export interface HodDashboard {
  totalFaculty: number;
  upcomingDepartmentDuties: number;
  pendingTransferRequests: number;
  pendingSwapRequests: number;
}

export interface DashboardPendingRequests {
  transfers: TransferRequest[];
  swaps: SwapRequest[];
}

export type UpcomingExam = Exam;

/**
 * Temporary.
 * We'll replace this once Activity Logs module is built.
 */
export interface RecentActivity {
  id: string;

  action: string;

  description: string;

  createdAt: string;

  employee: {
    id: string;
    employeeCode: string;
    name: string;
    role: string;
  };
}

export interface FacultyWorkload {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;

  attendedCount: number;
  averageDuty: number;
  transferCount: number;
}
