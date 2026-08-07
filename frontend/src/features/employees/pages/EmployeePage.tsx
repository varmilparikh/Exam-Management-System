import { useState } from "react";

import PageHeader from "@/components/common/PageHeader";

import PermissionGate from "@/permissions/PermissionGate";

import CreateEmployeeDialog from "../dialogs/CreateEmployeeDialog";
import EmployeeToolbar from "../components/EmployeeToolbar";
import EmployeeTable from "../components/EmployeeTable";

import type { EmployeeFilters } from "../types/employeeFilters";

export default function EmployeesPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    departmentId: "",
    role: "",
    status: "",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage university employees."
        actions={
          <PermissionGate permission="employee:create">
            <CreateEmployeeDialog />
          </PermissionGate>
        }
      />

      <EmployeeToolbar filters={filters} onFiltersChange={setFilters} />

      <EmployeeTable filters={filters} />
    </div>
  );
}
