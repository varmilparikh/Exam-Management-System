import { hasRole, type UserRole } from "./roles";

export const canCreateDepartment = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN"]);
