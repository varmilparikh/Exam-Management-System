import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";

import { useEmployees } from "@/features/employees/hooks/useEmployees";
import { useFacultyUpcomingDuties } from "@/features/exam-duties/hooks/useFacultyUpcomingDuties";

import {
  createSwapRequestSchema,
  type CreateSwapRequestFormValues,
} from "../schemas/swapRequest.schema";

interface Props {
  requesterDutyId: string;
  loading?: boolean;

  onSubmit: (data: CreateSwapRequestFormValues) => Promise<void>;
}

export default function SwapRequestForm({
  requesterDutyId,
  loading,
  onSubmit,
}: Props) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSwapRequestFormValues>({
    resolver: zodResolver(createSwapRequestSchema),

    defaultValues: {
      requesterDutyId,
      receiverId: "",
      receiverDutyId: "",
      reason: "",
    },
  });

  const receiverId = watch("receiverId");

  const { data: employees = [] } = useEmployees();

  const { data: duties = [] } = useFacultyUpcomingDuties(receiverId);

  const facultyOptions = useMemo(
    () =>
      employees
        .filter((employee) => employee.role === "FACULTY" && employee.isActive)
        .map((employee) => ({
          label: `${employee.name} (${employee.employeeCode})`,
          value: employee.id,
        })),
    [employees],
  );

  const dutyOptions = useMemo(
    () =>
      duties.map((duty) => ({
        value: duty.id,

        label: `${duty.exam.examName} • ${new Date(
          duty.exam.examDate,
        ).toLocaleDateString()}`,
      })),
    [duties],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField label="Faculty" required error={errors.receiverId?.message}>
        <Select
          options={facultyOptions}
          placeholder="Select Faculty"
          {...register("receiverId")}
        />
      </FormField>

      <FormField
        label="Duty to Swap"
        required
        error={errors.receiverDutyId?.message}
      >
        <Select
          options={dutyOptions}
          placeholder="Select Duty"
          disabled={!receiverId}
          {...register("receiverDutyId")}
        />
      </FormField>

      <FormField label="Reason" error={errors.reason?.message}>
        <textarea
          className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          {...register("reason")}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Send Swap Request
        </Button>
      </div>
    </form>
  );
}
