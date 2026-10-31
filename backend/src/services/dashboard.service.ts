import dashboardRepository from "../repositories/dashboard.repository.js";

import type {
  CoeDashboardDto,
  FacultyDashboardDto,
  HodDashboardDto,
} from "../types/dashboard.types.js";

import { ApiError } from "../utils/apiError.js";
import { Role } from "../generated/prisma/client.js";

class DashboardService {
  async getCoeDashboard(): Promise<CoeDashboardDto> {
    const [
      totalEmployees,
      totalDepartments,
      totalUpcomingExams,
      completedExams,
      todayExams,
      assignedDuties,
      pendingTransferRequests,
      pendingSwapRequests,
      pendingExamOptIns,
      totalNotifications,
      totalActivityLogs,
    ] = await Promise.all([
      dashboardRepository.countEmployees(),
      dashboardRepository.countDepartments(),
      dashboardRepository.countUpcomingExams(),
      dashboardRepository.countCompletedExams(),
      dashboardRepository.countTodayExams(),
      dashboardRepository.countAssignedDuties(),
      dashboardRepository.countPendingTransferRequests(),
      dashboardRepository.countPendingSwapRequests(),
      dashboardRepository.countPendingExamOptIns(),
      dashboardRepository.countNotifications(),
      dashboardRepository.countActivityLogs(),
    ]);

    return {
      totalEmployees,
      totalDepartments,
      totalUpcomingExams,
      completedExams,
      todayExams,
      assignedDuties,
      pendingTransferRequests,
      pendingSwapRequests,
      pendingExamOptIns,
      totalNotifications,
      totalActivityLogs,
    };
  }

  async getFacultyDashboard(employeeId: string): Promise<FacultyDashboardDto> {
    const [
      myUpcomingDuties,
      completedDuties,
      pendingTransferRequests,
      pendingSwapRequests,
      unreadNotifications,
      pendingExamOptIns,
    ] = await Promise.all([
      dashboardRepository.countUpcomingDuties(employeeId),
      dashboardRepository.countCompletedDuties(employeeId),
      dashboardRepository.countPendingTransfersByEmployee(employeeId),
      dashboardRepository.countPendingSwapsByEmployee(employeeId),
      dashboardRepository.countUnreadNotifications(employeeId),
      dashboardRepository.countEmployeePendingExamOptIns(employeeId),
    ]);

    return {
      myUpcomingDuties,
      completedDuties,
      pendingTransferRequests,
      pendingSwapRequests,
      unreadNotifications,
      pendingExamOptIns,
    };
  }

  async getHodDashboard(employeeId: string): Promise<HodDashboardDto> {
    const departmentId =
      await dashboardRepository.getDepartmentIdByEmployee(employeeId);

    if (!departmentId) {
      throw new ApiError(404, "Department not found");
    }

    const [
      totalFaculty,
      upcomingDepartmentDuties,
      pendingTransferRequests,
      pendingSwapRequests,
      pendingExamOptIns,
    ] = await Promise.all([
      dashboardRepository.countFacultyByDepartment(departmentId),
      dashboardRepository.countUpcomingDepartmentDuties(departmentId),
      dashboardRepository.countDepartmentPendingTransfers(departmentId),
      dashboardRepository.countDepartmentPendingSwaps(departmentId),
      dashboardRepository.countDepartmentPendingExamOptIns(departmentId),
    ]);

    return {
      totalFaculty,
      upcomingDepartmentDuties,
      pendingTransferRequests,
      pendingSwapRequests,
      pendingExamOptIns,
    };
  }

  async getRecentActivities(limit: number) {
    return dashboardRepository.getRecentActivities(limit);
  }

  /**
   * Get Upcoming Exams
   */
  async getUpcomingExams(limit: number) {
    return dashboardRepository.getUpcomingExams(limit);
  }

  /**
   * Get Pending Dashboard Requests
   */
  async getPendingRequests(limit: number) {
    const [transfers, swaps] = await Promise.all([
      dashboardRepository.getPendingTransferRequests(limit),
      dashboardRepository.getPendingSwapRequests(limit),
    ]);

    return {
      transfers,
      swaps,
    };
  }

  /**
   * Get Faculty Workload
   */
  async getFacultyWorkload(
    limit: number,
    user: { id: string; role: Role },
  ) {
    if (user.role === Role.HOD) {
      const departmentId =
        await dashboardRepository.getDepartmentIdByEmployee(user.id);
      if (!departmentId) {
        throw new ApiError(404, "Department not found");
      }
      return dashboardRepository.getFacultyWorkload(limit, departmentId);
    }

    return dashboardRepository.getFacultyWorkload(limit);
  }
}

export default new DashboardService();
