import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";

import {
  departmentSchema,
  type DepartmentFormValues,
} from "../schemas/department.schema";

interface DepartmentFormProps {
  initialValues?: Partial<DepartmentFormValues>;

  onSubmit: (data: DepartmentFormValues) => Promise<void>;

  submitLabel?: string;

  loading?: boolean;
}

export default function DepartmentForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Department",
  loading = false,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
    },
  });

  const submit = async (data: DepartmentFormValues) => {
    try {
      await onSubmit(data);
      reset();
    } catch {
      // Keep form values if submission fails.
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <FormField label="Department Name" required error={errors.name?.message}>
        <Input placeholder="Computer Science" {...register("name")} />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
