import { hasRole, type UserRole } from "./roles";

export const canApproveTransfer = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN", "COE"]);

export const canApproveSwap = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN", "COE"]);

export const canCreateTransfer = (role?: UserRole) =>
  hasRole(role, ["FACULTY"]);

export const canCreateSwap = canCreateTransfer;
