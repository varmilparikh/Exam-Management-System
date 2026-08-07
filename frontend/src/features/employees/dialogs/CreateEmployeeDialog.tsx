import { useState } from "react";

import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

import EmployeeForm from "../forms/EmployeeForm";

import { useCreateEmployee } from "../hooks/useCreateEmployee";

import type { CreateEmployeeDto } from "../api/employee.service";

import type { EmployeeFormValues } from "../schemas/employee.schema";

export default function CreateEmployeeDialog() {
  const [open, setOpen] = useState(false);

  const mutation = useCreateEmployee();

  const handleSubmit = async (data: EmployeeFormValues) => {
    await mutation.mutateAsync(data as CreateEmployeeDto);

    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Employee</Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="2xl">
          <Dialog.Header
            title="Create Employee"
            description="Add a new employee."
          />

          <Dialog.Body>
            <EmployeeForm
              onSubmit={handleSubmit}
              loading={mutation.isPending}
              submitLabel="Create Employee"
              showPassword
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
