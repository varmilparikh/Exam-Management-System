import { useMemo } from "react";

import type { EmployeeFilters } from "../types/employeeFilters";

import Toolbar, {
  ToolbarLeft,
  ToolbarRight,
  ToolbarSearch,
  ToolbarFilter,
} from "@/components/common/Toolbar";

import Button from "@/components/ui/Button";

import { ROLE_OPTIONS } from "@/constants/roles";

import { useDepartments } from "@/features/departments/hooks/useDepartments";

interface EmployeeToolbarProps {
  filters: EmployeeFilters;

  onFiltersChange: (filters: EmployeeFilters) => void;
}

export default function EmployeeToolbar({
  filters,
  onFiltersChange,
}: EmployeeToolbarProps) {
  const { data: departments = [] } = useDepartments();

  const departmentOptions = useMemo(
    () =>
      departments.map((d) => ({
        label: d.name,
        value: d.id,
      })),
    [departments],
  );

  const statusOptions = [
    {
      label: "Active",
      value: "ACTIVE",
    },
    {
      label: "Inactive",
      value: "INACTIVE",
    },
  ];

  return (
    <Toolbar>
      <ToolbarLeft>
        <ToolbarSearch
          value={filters.search}
          onChange={(value) => onFiltersChange({ ...filters, search: value })}
          placeholder="Search employees..."
        />

        <ToolbarFilter
          value={filters.departmentId}
          onChange={(value) =>
            onFiltersChange({ ...filters, departmentId: value })
          }
          placeholder="Department"
          options={departmentOptions}
        />

        <ToolbarFilter
          value={filters.role}
          onChange={(value) => onFiltersChange({ ...filters, role: value })}
          placeholder="Role"
          options={ROLE_OPTIONS}
        />

        <ToolbarFilter
          value={filters.status}
          onChange={(value) => onFiltersChange({ ...filters, status: value })}
          placeholder="Status"
          options={statusOptions}
        />
      </ToolbarLeft>

      <ToolbarRight>
        <Button variant="secondary">Import CSV</Button>

        <Button variant="secondary">Export CSV</Button>
      </ToolbarRight>
    </Toolbar>
  );
}
