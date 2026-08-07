import type { Permission } from "./permissions";
import { rolePermissions } from "./rolePermissions";
import type { Employee } from "@/features/employees/types/employee";

export function hasPermission(
  role: Employee["role"] | undefined,
  permission: Permission,
) {
  if (!role) return false;

  return rolePermissions[role].includes(permission);
}
