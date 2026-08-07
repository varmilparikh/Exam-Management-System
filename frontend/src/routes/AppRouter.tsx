import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";

import { DashboardPage } from "@/features/dashboard";
import { LoginPage } from "@/features/auth";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import { DepartmentsPage } from "@/features/departments";
import { EmployeesPage } from "@/features/employees";
import { ExamsPage } from "@/features/exams";
import { ExamDutiesPage } from "@/features/exam-duties";
import { TransferRequestsPage } from "@/features/transfer-requests";
import { ROUTES } from "@/constants/routes";
import SwapRequestsPage from "@/features/swap-requests/pages/SwapRequestsPage";
import PermissionRoute from "./PermissionRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.HOME} element={<DashboardPage />} />

          <Route
            path={ROUTES.DEPARTMENTS}
            element={
              <PermissionRoute permission="department:view">
                <DepartmentsPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.EMPLOYEES}
            element={
              <PermissionRoute permission="employee:view">
                <EmployeesPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.EXAMS}
            element={
              <PermissionRoute permission="exam:view">
                <ExamsPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.DUTIES}
            element={
              <PermissionRoute permission="duty:view">
                <ExamDutiesPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.TRANSFER_REQUESTS}
            element={
              <PermissionRoute permission="transfer:view">
                <TransferRequestsPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.SWAP_REQUESTS}
            element={
              <PermissionRoute permission="swap:view">
                <SwapRequestsPage />
              </PermissionRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
