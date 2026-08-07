import { hasRole, type UserRole } from "./roles";

export const showQuickActions = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN", "COE"]);

export const showFacultyDashboard = (role?: UserRole) => role === "FACULTY";

export const showAdminDashboard = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN", "COE"]);

export const showHodDashboard = (role?: UserRole) => role === "HOD";
