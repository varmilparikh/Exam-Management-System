import type { Column } from "@/components/common/DataTable";

import type { Department } from "./types/department";
import EditDepartmentDialog from "./dialogs/EditDepartmentDialog";
import DeleteDepartmentDialog from "./dialogs/DeleteDepartmentDialog";

export function getDepartmentColumns(): Column<Department>[] {
  return [
    {
      key: "name",
      title: "Department Name",
    },
    {
      key: "id",
      title: "Actions",
      align: "right",

      render: (department) => (
        <div className="flex justify-end gap-2">
          <EditDepartmentDialog department={department} />

          <DeleteDepartmentDialog department={department} />
        </div>
      ),
    },
  ];
}
