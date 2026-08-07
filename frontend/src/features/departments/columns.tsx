import type { Column } from "@/components/common/DataTable";

import type { Department } from "./types/department";

import EditDepartmentDialog from "./dialogs/EditDepartmentDialog";
import DeleteDepartmentDialog from "./dialogs/DeleteDepartmentDialog";

interface DepartmentColumnOptions {
  canEdit: boolean;
  canDelete: boolean;
}

export function getDepartmentColumns({
  canEdit,
  canDelete,
}: DepartmentColumnOptions): Column<Department>[] {
  const columns: Column<Department>[] = [
    {
      id: "name",
      key: "name",
      title: "Department Name",
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      id: "canEdit || canDelete",
      key: "id",
      title: "Actions",
      align: "right",

      render: (department) => (
        <div className="flex justify-end gap-2">
          {canEdit && <EditDepartmentDialog department={department} />}

          {canDelete && <DeleteDepartmentDialog department={department} />}
        </div>
      ),
    });
  }

  return columns;
}
