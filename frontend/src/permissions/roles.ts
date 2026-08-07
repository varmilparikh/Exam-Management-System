export type UserRole = "SUPER_ADMIN" | "COE" | "HOD" | "FACULTY";

export const isSuperAdmin = (role?: UserRole) => role === "SUPER_ADMIN";

export const isCoe = (role?: UserRole) => role === "COE";

export const isHod = (role?: UserRole) => role === "HOD";

export const isFaculty = (role?: UserRole) => role === "FACULTY";

export const hasRole = (role: UserRole | undefined, allowed: UserRole[]) =>
  !!role && allowed.includes(role);
