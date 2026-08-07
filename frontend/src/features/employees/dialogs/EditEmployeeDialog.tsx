import { useState } from "react";

import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

import EmployeeForm from "../forms/EmployeeForm";

import { useUpdateEmployee } from "../hooks/useUpdateEmployee";

import type { Employee } from "../types/employee";
import type { EmployeeFormValues } from "../schemas/employee.schema";
import type { UpdateEmployeeDto } from "../api/employee.service";

interface EditEmployeeDialogProps {
  employee: Employee;
}

export default function EditEmployeeDialog({
  employee,
}: EditEmployeeDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useUpdateEmployee();

  const handleSubmit = async (data: EmployeeFormValues) => {
    const payload: UpdateEmployeeDto = {
      employeeCode: data.employeeCode,
      name: data.name,
      email: data.email,
      designation: data.designation,
      departmentId: data.departmentId,
      role: data.role,
      ...(data.phone ? { phone: data.phone } : {}),
    };

    await mutation.mutateAsync({
      id: employee.id,
      data: payload,
    });

    setOpen(false);
  };

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        Edit
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="2xl">
          <Dialog.Header
            title="Edit Employee"
            description="Update employee information."
          />

          <Dialog.Body>
            <EmployeeForm
              initialValues={employee}
              onSubmit={handleSubmit}
              loading={mutation.isPending}
              submitLabel="Update Employee"
              showPassword={false}
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
