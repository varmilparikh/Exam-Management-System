import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormField from "@/components/ui/FormField";

import { ROLE_OPTIONS } from "@/constants/roles";

import { useDepartments } from "@/features/departments/hooks/useDepartments";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
  type EmployeeFormValues,
} from "../schemas/employee.schema";

interface EmployeeFormProps {
  initialValues?: Partial<EmployeeFormValues>;

  onSubmit: (data: EmployeeFormValues) => Promise<void>;

  submitLabel?: string;

  loading?: boolean;

  showPassword?: boolean;
}

export default function EmployeeForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Employee",
  loading = false,
  showPassword = true,
}: EmployeeFormProps) {
  const { data: departments = [] } = useDepartments();

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        label: department.name,
        value: department.id,
      })),
    [departments],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(
      showPassword ? createEmployeeSchema : updateEmployeeSchema,
    ),

    defaultValues: {
      employeeCode: initialValues?.employeeCode ?? "",
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      password: "",
      designation: initialValues?.designation ?? "",
      phone: initialValues?.phone ?? "",
      departmentId: initialValues?.departmentId ?? "",
      role: initialValues?.role,
    },
  });

  const submit = async (data: EmployeeFormValues) => {
    const normalized: EmployeeFormValues = {
      ...data,
      phone: data.phone?.trim() || undefined,
    };

    try {
      await onSubmit(normalized);
      reset();
    } catch {
      // Keep values
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Employee Code"
          required
          error={errors.employeeCode?.message}
        >
          <Input placeholder="EMP001" {...register("employeeCode")} />
        </FormField>

        <FormField label="Full Name" required error={errors.name?.message}>
          <Input placeholder="John Doe" {...register("name")} />
        </FormField>

        <FormField label="Email" required error={errors.email?.message}>
          <Input
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
        </FormField>

        {showPassword && (
          <FormField label="Password" required error={errors.password?.message}>
            <Input
              type="password"
              placeholder="********"
              {...register("password")}
            />
          </FormField>
        )}

        <FormField
          label="Designation"
          required
          error={errors.designation?.message}
        >
          <Input
            placeholder="Assistant Professor"
            {...register("designation")}
          />
        </FormField>

        <FormField label="Phone" error={errors.phone?.message}>
          <Input placeholder="9876543210" {...register("phone")} />
        </FormField>

        <FormField
          label="Department"
          required
          error={errors.departmentId?.message}
        >
          <Select
            placeholder="Select Department"
            options={departmentOptions}
            {...register("departmentId")}
          />
        </FormField>

        <FormField label="Role" required error={errors.role?.message}>
          <Select
            placeholder="Select Role"
            options={ROLE_OPTIONS}
            {...register("role")}
          />
        </FormField>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
