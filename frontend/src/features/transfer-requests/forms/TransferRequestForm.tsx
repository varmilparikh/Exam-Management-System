import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";

import { useEmployees } from "@/features/employees/hooks/useEmployees";

import {
  createTransferRequestSchema,
  type CreateTransferRequestFormValues,
} from "../schemas/transferRequest.schema";

interface Props {
  loading?: boolean;

  examDutyId: string;

  onSubmit: (data: CreateTransferRequestFormValues) => Promise<void>;
}

export default function TransferRequestForm({
  examDutyId,
  loading,
  onSubmit,
}: Props) {
  const { data: employees = [] } = useEmployees();

  const employeeOptions = useMemo(
    () =>
      employees
        .filter((employee) => employee.isActive && employee.role === "FACULTY")
        .map((employee) => ({
          label: `${employee.name} (${employee.employeeCode})`,
          value: employee.id,
        })),
    [employees],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransferRequestFormValues>({
    resolver: zodResolver(createTransferRequestSchema),

    defaultValues: {
      examDutyId,
      toEmployeeId: "",
      reason: "",
    },
  });

  const submit = async (data: CreateTransferRequestFormValues) => {
    const normalized = {
      ...data,
      toEmployeeId: data.toEmployeeId || undefined,
    };

    await onSubmit(normalized);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <input type="hidden" {...register("examDutyId")} />
      <FormField
        label="Replacement Faculty"
        error={errors.toEmployeeId?.message}
      >
        <Select
          placeholder="Select faculty (optional)"
          options={employeeOptions}
          {...register("toEmployeeId")}
        />
      </FormField>

      <FormField label="Reason" required error={errors.reason?.message}>
        <textarea
          className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Explain why you want to transfer this duty..."
          {...register("reason")}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Submit Request
        </Button>
      </div>
    </form>
  );
}
