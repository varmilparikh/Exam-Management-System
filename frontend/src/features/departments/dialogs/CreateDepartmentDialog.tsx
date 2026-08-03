import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

import DepartmentForm from "../forms/DepartmentForm";

import { useCreateDepartment } from "../hooks/useCreateDepartment";

import type { DepartmentFormValues } from "../schemas/department.schema";

export default function CreateDepartmentDialog() {
  const [open, setOpen] = useState(false);

  const mutation = useCreateDepartment();

  const handleSubmit = async (data: DepartmentFormValues) => {
    try {
      await mutation.mutateAsync(data);
      setOpen(false);
    } catch {
      // Error toast is already handled in the mutation hook.
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Add Department</Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="md">
          <Dialog.Header
            title="Create Department"
            description="Add a new department."
          />

          <Dialog.Body>
            <DepartmentForm
              onSubmit={handleSubmit}
              loading={mutation.isPending}
              submitLabel="Create Department"
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
