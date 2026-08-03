import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

import DepartmentForm from "../forms/DepartmentForm";

import { useUpdateDepartment } from "../hooks/useUpdateDepartment";

import type { Department } from "../types/department";
import type { DepartmentFormValues } from "../schemas/department.schema";

interface EditDepartmentDialogProps {
  department: Department;
}

export default function EditDepartmentDialog({
  department,
}: EditDepartmentDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useUpdateDepartment();

  const handleSubmit = async (data: DepartmentFormValues) => {
    await mutation.mutateAsync({
      id: department.id,
      data,
    });

    setOpen(false);
  };

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        Edit
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="md">
          <Dialog.Header
            title="Edit Department"
            description="Update department information."
          />

          <Dialog.Body>
            <DepartmentForm
              initialValues={{
                name: department.name,
              }}
              onSubmit={handleSubmit}
              loading={mutation.isPending}
              submitLabel="Save Changes"
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
