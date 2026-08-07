import { useState } from "react";

import PageHeader from "@/components/common/PageHeader";

import CreateDepartmentDialog from "../dialogs/CreateDepartmentDialog";
import DepartmentTable from "../components/DepartmentTable";
import DepartmentToolbar from "../components/DepartmentToolbar";
import PermissionGate from "@/permissions/PermissionGate";
import type { DepartmentFilters } from "../types/departmentFilters";

export default function DepartmentsPage() {
  const [filters, setFilters] = useState<DepartmentFilters>({
    search: "",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage university departments."
        actions={
          <PermissionGate permission="department:create">
            <CreateDepartmentDialog />
          </PermissionGate>
        }
      />

      <DepartmentToolbar filters={filters} onFiltersChange={setFilters} />

      <DepartmentTable filters={filters} />
    </div>
  );
}
