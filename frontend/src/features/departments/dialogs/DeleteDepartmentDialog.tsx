import { useState } from "react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { useDeleteDepartment } from "../hooks/useDeleteDepartment";

import type { Department } from "../types/department";

interface DeleteDepartmentDialogProps {
  department: Department;
}

export default function DeleteDepartmentDialog({
  department,
}: DeleteDepartmentDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useDeleteDepartment();

  const handleDelete = async () => {
    await mutation.mutateAsync(department.id);
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Delete
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete Department"
        description={`Are you sure you want to delete "${department.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={mutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
