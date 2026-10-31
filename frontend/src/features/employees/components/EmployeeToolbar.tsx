import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { EmployeeFilters } from "../types/employeeFilters";

import Toolbar, {
  ToolbarLeft,
  ToolbarRight,
  ToolbarSearch,
  ToolbarFilter,
} from "@/components/common/Toolbar";

import Button from "@/components/ui/Button";
import PermissionGate from "@/permissions/PermissionGate";

import { ROLE_OPTIONS } from "@/constants/roles";

import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { employeeService } from "../api/employee.service";
import ImportEmployeesDialog from "../dialogs/ImportEmployeesDialog";
import { downloadBlob } from "@/features/reports/utils/downloadReport";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface EmployeeToolbarProps {
  filters: EmployeeFilters;

  onFiltersChange: (filters: EmployeeFilters) => void;
}

export default function EmployeeToolbar({
  filters,
  onFiltersChange,
}: EmployeeToolbarProps) {
  const { data: departments = [] } = useDepartments();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      const employees = await employeeService.getAll(filters);
      const fields = [
        "employeeCode",
        "name",
        "email",
        "designation",
        "phone",
        "department",
        "role",
        "status",
      ] as const;
      const escape = (value: unknown) =>
        `"${String(value ?? "").replaceAll('"', '""')}"`;
      const rows = [
        fields.join(","),
        ...employees.map((employee) =>
          [
            employee.employeeCode,
            employee.name,
            employee.email,
            employee.designation,
            employee.phone,
            employee.department?.name,
            employee.role,
            employee.isActive ? "ACTIVE" : "INACTIVE",
          ]
            .map(escape)
            .join(","),
        ),
      ];

      downloadBlob(
        new Blob([`\uFEFF${rows.join("\r\n")}`], {
          type: "text/csv;charset=utf-8",
        }),
        "employees.csv",
      );
      toast.success(`Exported ${employees.length} employee(s).`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setExporting(false);
    }
  };

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
        <PermissionGate permission="employee:create">
          <ImportEmployeesDialog />
        </PermissionGate>

        <Button variant="secondary" loading={exporting} onClick={handleExport}>
          Export CSV
        </Button>
      </ToolbarRight>
    </Toolbar>
  );
}
