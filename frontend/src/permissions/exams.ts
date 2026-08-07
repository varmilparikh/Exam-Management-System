import { hasRole, type UserRole } from "./roles";

export const canCreateExam = (role?: UserRole) =>
  hasRole(role, ["SUPER_ADMIN", "COE"]);

export const canEditExam = canCreateExam;

export const canDeleteExam = canCreateExam;
