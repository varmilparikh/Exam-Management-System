import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";

import { DashboardPage } from "@/features/dashboard";
import { LoginPage } from "@/features/auth";
import { DepartmentsPage } from "@/features/departments";
import { EmployeesPage } from "@/features/employees";
import { ExamsPage } from "@/features/exams";
import { ExamDutiesPage } from "@/features/exam-duties";
import { TransferRequestsPage } from "@/features/transfer-requests";
import SwapRequestsPage from "@/features/swap-requests/pages/SwapRequestsPage";
import {
  ReportsPage,
  FacultyWorkloadReportPage,
  ExamReportPage,
  WorkflowReportPage,
  DutyReportPage,
  ActivityReportPage,
} from "@/features/reports";
import { ActivityLogsPage } from "@/features/activity-logs";
import { NotificationsPage } from "@/features/notifications";
import ExamOptInsPage from "@/features/exam-opt-ins/pages/ExamOptInsPage";

import { ROUTES } from "@/constants/routes";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PermissionRoute from "./PermissionRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* ================= PROTECTED ================= */}

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path={ROUTES.HOME} element={<DashboardPage />} />

          {/* Departments */}
          <Route
            path={ROUTES.DEPARTMENTS}
            element={
              <PermissionRoute permission="department:view">
                <DepartmentsPage />
              </PermissionRoute>
            }
          />

          {/* Employees */}
          <Route
            path={ROUTES.EMPLOYEES}
            element={
              <PermissionRoute permission="employee:view">
                <EmployeesPage />
              </PermissionRoute>
            }
          />

          {/* Exams */}
          <Route
            path={ROUTES.EXAMS}
            element={
              <PermissionRoute permission="exam:view">
                <ExamsPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.EXAM_OPT_INS}
            element={
              <PermissionRoute permission="exam-opt-in:view">
                <ExamOptInsPage />
              </PermissionRoute>
            }
          />

          {/* Exam Duties */}
          <Route
            path={ROUTES.DUTIES}
            element={
              <PermissionRoute permission="duty:view">
                <ExamDutiesPage />
              </PermissionRoute>
            }
          />

          {/* Transfer Requests */}
          <Route
            path={ROUTES.TRANSFER_REQUESTS}
            element={
              <PermissionRoute permission="transfer:view">
                <TransferRequestsPage />
              </PermissionRoute>
            }
          />

          {/* Swap Requests */}
          <Route
            path={ROUTES.SWAP_REQUESTS}
            element={
              <PermissionRoute permission="swap:view">
                <SwapRequestsPage />
              </PermissionRoute>
            }
          />

          {/* Reports */}
          <Route
            path={ROUTES.REPORTS}
            element={
              <PermissionRoute permission="reports:view">
                <ReportsPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.REPORTS_WORKLOAD}
            element={
              <PermissionRoute permission="workload:view">
                <FacultyWorkloadReportPage />
              </PermissionRoute>
            }
          />

          <Route path={ROUTES.REPORTS_DUTIES} element={<PermissionRoute permission="workload:view"><DutyReportPage /></PermissionRoute>} />

          <Route path={ROUTES.REPORTS_ACTIVITY} element={<PermissionRoute permission="activity:view"><ActivityReportPage /></PermissionRoute>} />

          <Route
            path={ROUTES.REPORTS_EXAMS}
            element={
              <PermissionRoute permission="reports:view">
                <ExamReportPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.REPORTS_TRANSFERS}
            element={
              <PermissionRoute permission="reports:view">
                <WorkflowReportPage kind="transfers" />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.REPORTS_SWAPS}
            element={
              <PermissionRoute permission="reports:view">
                <WorkflowReportPage kind="swaps" />
              </PermissionRoute>
            }
          />

          {/* Activity log and notifications */}
          <Route
            path={ROUTES.ACTIVITY_LOGS}
            element={
              <PermissionRoute permission="activity:view">
                <ActivityLogsPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.NOTIFICATIONS}
            element={
              <PermissionRoute permission="notification:view">
                <NotificationsPage />
              </PermissionRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
