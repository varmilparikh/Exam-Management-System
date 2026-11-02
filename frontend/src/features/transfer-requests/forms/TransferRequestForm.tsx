import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";

import { useFacultyOptions } from "@/features/employees/hooks/useEmployees";

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
  const { data: faculty = [] } = useFacultyOptions();

  const employeeOptions = useMemo(
    () =>
      faculty.map((employee) => ({
        label: `${employee.name} (${employee.employeeCode})`,
        value: employee.id,
      })),
    [faculty],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTransferRequestFormValues>({
    resolver: zodResolver(createTransferRequestSchema),

    defaultValues: {
      examDutyId,
      requestType: "REPLACEMENT_FOUND",
      toEmployeeId: "",
      reason: "",
    },
  });
  const requestType = useWatch({ control, name: "requestType" });

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
      <FormField label="Request type" required>
        <Select
          options={[
            { value: "REPLACEMENT_FOUND", label: "I have found a replacement" },
            {
              value: "NEEDS_ASSISTANCE",
              label: "I need help finding a replacement",
            },
          ]}
          {...register("requestType")}
        />
      </FormField>
      {requestType === "REPLACEMENT_FOUND" ? (
        <FormField
          label="Replacement Faculty"
          error={errors.toEmployeeId?.message}
        >
          <Select
            placeholder="Select replacement faculty"
            options={employeeOptions}
            {...register("toEmployeeId")}
          />
        </FormField>
      ) : (
        <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          COE and Super Admin will find and assign a replacement.
        </p>
      )}

      <FormField label="Reason" required error={errors.reason?.message}>
        <textarea
          className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
