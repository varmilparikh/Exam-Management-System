import { hasRole, type UserRole } from "./roles";

export const canViewEmployees = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN", "COE", "HOD"]);

export const canCreateEmployee = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN"]);

export const canEditEmployee = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN"]);

export const canDeleteEmployee = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN"]);
