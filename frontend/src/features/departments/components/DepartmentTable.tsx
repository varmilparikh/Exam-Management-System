import { useMemo } from "react";

import DataTable from "@/components/common/DataTable";

import { useDepartments } from "../hooks/useDepartments";
import { getDepartmentColumns } from "../columns";

import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/permissions/hasPermission";

import type { DepartmentFilters } from "../types/departmentFilters";

interface DepartmentTableProps {
  filters: DepartmentFilters;
}

export default function DepartmentTable({ filters }: DepartmentTableProps) {
  const { data = [], isLoading } = useDepartments(filters);

  const { user } = useAuth();

  const canEdit = hasPermission(user?.role, "department:edit");

  const canDelete = hasPermission(user?.role, "department:delete");

  const columns = useMemo(
    () =>
      getDepartmentColumns({
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
      emptyMessage="No departments found."
    />
  );
}
