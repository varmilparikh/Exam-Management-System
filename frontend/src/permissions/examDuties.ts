import { hasRole, type UserRole } from "./roles";

export const canAssignDuty = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN", "COE"]);

export const canUpdateDuty = canAssignDuty;

export const canDeleteDuty = canAssignDuty;
