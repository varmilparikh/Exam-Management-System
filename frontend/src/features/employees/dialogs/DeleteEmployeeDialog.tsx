import { useState } from "react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { useDeleteEmployee } from "../hooks/useDeleteEmployee";

import type { Employee } from "../types/employee";

interface DeleteEmployeeDialogProps {
  employee: Employee;
}

export default function DeleteEmployeeDialog({
  employee,
}: DeleteEmployeeDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useDeleteEmployee();

  const handleDelete = async () => {
    await mutation.mutateAsync(employee.id);
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Delete
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete Employee"
        description={`Are you sure you want to delete "${employee.name}"?`}
        confirmText="Delete"
        loading={mutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
