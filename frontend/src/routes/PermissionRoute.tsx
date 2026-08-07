import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

import type { Permission } from "@/permissions";
import { rolePermissions } from "@/permissions";

interface PermissionRouteProps {
  permission: Permission;
  children: ReactNode;
}

export default function PermissionRoute({
  permission,
  children,
}: PermissionRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const permissions = rolePermissions[user.role];

  if (!permissions.includes(permission)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
