import { useMemo } from "react";

import DataTable from "@/components/common/DataTable";

import { useEmployees } from "../hooks/useEmployees";
import { getEmployeeColumns } from "../columns";

import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/permissions/hasPermission";
import type { EmployeeFilters } from "../types/employeeFilters";

interface EmployeeTableProps {
  filters: EmployeeFilters;
}

export default function EmployeeTable({ filters }: EmployeeTableProps) {
  const { data = [], isLoading, isError, refetch } = useEmployees(filters);
  const { user } = useAuth();

  const canEdit = hasPermission(user?.role, "employee:edit");
  const canDelete = hasPermission(user?.role, "employee:delete");

  const columns = useMemo(
    () =>
      getEmployeeColumns({
        canEdit,
        canDelete,
      }),
    [canEdit, canDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={isLoading}
      error={isError}
      onRetry={() => void refetch()}
      errorMessage="Employee records could not be retrieved. Check your connection and try again."
      emptyMessage="No employees found."
    />
  );
}
