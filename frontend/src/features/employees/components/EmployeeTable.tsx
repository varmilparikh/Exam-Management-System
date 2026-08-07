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
  const { data = [], isLoading } = useEmployees(filters);
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
      emptyMessage="No employees found."
    />
  );
}
