import { useMemo } from "react";

import { useAuth } from "@/hooks/useAuth";

import { hasPermission } from "./hasPermission";

export function usePermissions() {
  const { user } = useAuth();

  return useMemo(
    () => ({
      canViewEmployee: hasPermission(user?.role, "employee:view"),
      canCreateEmployee: hasPermission(user?.role, "employee:create"),
      canEditEmployee: hasPermission(user?.role, "employee:edit"),
      canDeleteEmployee: hasPermission(user?.role, "employee:delete"),

      canViewDepartment: hasPermission(user?.role, "department:view"),
      canCreateDepartment: hasPermission(user?.role, "department:create"),
      canEditDepartment: hasPermission(user?.role, "department:edit"),
      canDeleteDepartment: hasPermission(user?.role, "department:delete"),

      canViewExam: hasPermission(user?.role, "exam:view"),
      canCreateExam: hasPermission(user?.role, "exam:create"),
      canEditExam: hasPermission(user?.role, "exam:edit"),
      canDeleteExam: hasPermission(user?.role, "exam:delete"),

      canViewDuty: hasPermission(user?.role, "duty:view"),
      canAssignDuty: hasPermission(user?.role, "duty:assign"),

      canApproveTransfer: hasPermission(user?.role, "transfer:approve"),
      canApproveSwap: hasPermission(user?.role, "swap:approve"),

      canViewReports: hasPermission(user?.role, "reports:view"),
    }),
    [user?.role],
  );
}
