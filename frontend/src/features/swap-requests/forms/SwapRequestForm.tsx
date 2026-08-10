import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";

import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();

  const {
    register,
    control,
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

  /*
   * useWatch is preferred over watch() here because React Compiler
   * considers react-hook-form's watch() function incompatible with
   * automatic memoization.
   */
  const receiverId = useWatch({
    control,
    name: "receiverId",
  });

  const { data: employees = [] } = useEmployees();

  const { data: duties = [], isLoading: dutiesLoading } =
    useFacultyUpcomingDuties(receiverId);

  /*
   * Show only active faculty and prevent the logged-in faculty
   * from selecting themselves.
   */
  const facultyOptions = useMemo(
    () =>
      employees
        .filter(
          (employee) =>
            employee.role === "FACULTY" &&
            employee.isActive &&
            employee.id !== user?.id,
        )
        .map((employee) => ({
          label: `${employee.name} (${employee.employeeCode})`,
          value: employee.id,
        })),
    [employees, user?.id],
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
          placeholder={
            !receiverId
              ? "Select faculty first"
              : dutiesLoading
                ? "Loading duties..."
                : "Select Duty"
          }
          disabled={!receiverId || dutiesLoading}
          {...register("receiverDutyId")}
        />
      </FormField>

      <FormField label="Reason" error={errors.reason?.message}>
        <textarea
          className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Enter reason for requesting this swap..."
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
