import type { Column } from "@/components/common/DataTable";

import EditEmployeeDialog from "./dialogs/EditEmployeeDialog";
import DeleteEmployeeDialog from "./dialogs/DeleteEmployeeDialog";

import type { Employee } from "./types/employee";

interface EmployeeColumnOptions {
  canEdit: boolean;
  canDelete: boolean;
}

export function getEmployeeColumns({
  canEdit,
  canDelete,
}: EmployeeColumnOptions): Column<Employee>[] {
  const columns: Column<Employee>[] = [
    {
      id: "employeeCode",
      key: "employeeCode",
      title: "Code",
    },
    {
      id: "name",
      key: "name",
      title: "Name",
    },
    {
      id: "email",
      key: "email",
      title: "Email",
    },
    {
      id: "department",
      key: "department",
      title: "Department",
      render: (employee) => employee.department.name,
    },
    {
      id: "role",
      key: "role",
      title: "Role",
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      id: "canEdit || canDelete",
      key: "id",
      title: "Actions",
      align: "right",
      render: (employee) => (
        <div className="flex justify-end gap-2">
          {canEdit && <EditEmployeeDialog employee={employee} />}

          {canDelete && <DeleteEmployeeDialog employee={employee} />}
        </div>
      ),
    });
  }

  return columns;
}
