import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import Spinner from "@/components/ui/Spinner";

import LoginPage from "@/features/auth/pages/LoginPage";
import { ROUTES } from "@/constants/routes";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PermissionRoute from "./PermissionRoute";

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);
const DepartmentsPage = lazy(
  () => import("@/features/departments/pages/DepartmentPage"),
);
const EmployeesPage = lazy(
  () => import("@/features/employees/pages/EmployeePage"),
);
const ExamsPage = lazy(() => import("@/features/exams/pages/ExamsPage"));
const ExamOptInsPage = lazy(
  () => import("@/features/exam-opt-ins/pages/ExamOptInsPage"),
);
const ExamDutiesPage = lazy(
  () => import("@/features/exam-duties/pages/ExamDutiesPage"),
);
const TransferRequestsPage = lazy(
  () => import("@/features/transfer-requests/pages/TransferRequestsPage"),
);
const SwapRequestsPage = lazy(
  () => import("@/features/swap-requests/pages/SwapRequestsPage"),
);
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));
const FacultyWorkloadReportPage = lazy(
  () => import("@/features/reports/pages/FacultyWorkloadReportPage"),
);
const ExamReportPage = lazy(
  () => import("@/features/reports/pages/ExamReportPage"),
);
const WorkflowReportPage = lazy(
  () => import("@/features/reports/pages/WorkflowReportPage"),
);
const DutyReportPage = lazy(
  () => import("@/features/reports/pages/DutyReportPage"),
);
const ActivityReportPage = lazy(
  () => import("@/features/reports/pages/ActivityReportPage"),
);
const ActivityLogsPage = lazy(
  () => import("@/features/activity-logs/pages/ActivityLogsPage"),
);
const NotificationsPage = lazy(
  () => import("@/features/notifications/pages/NotificationsPage"),
);

function RouteLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center gap-3"
      role="status"
    >
      <Spinner size="lg" />
      <span className="text-sm text-slate-600">Loading page…</span>
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
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

            <Route
              path={ROUTES.REPORTS_DUTIES}
              element={
                <PermissionRoute permission="workload:view">
                  <DutyReportPage />
                </PermissionRoute>
              }
            />

            <Route
              path={ROUTES.REPORTS_ACTIVITY}
              element={
                <PermissionRoute permission="activity:view">
                  <ActivityReportPage />
                </PermissionRoute>
              }
            />

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
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
