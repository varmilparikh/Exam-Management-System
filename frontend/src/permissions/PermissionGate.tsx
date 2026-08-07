import type { ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth";

import type { Permission } from "./permissions";
import { rolePermissions } from "./rolePermissions";

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
}

export default function PermissionGate({
  permission,
  children,
}: PermissionGateProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const permissions = rolePermissions[user.role];

  if (!permissions.includes(permission)) {
    return null;
  }

  return <>{children}</>;
}
