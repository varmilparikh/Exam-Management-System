import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";

import {
  examSchema,
  type ExamFormInput,
  type ExamFormValues,
} from "../schemas/exam.schema";

interface ExamFormProps {
  initialValues?: Partial<ExamFormValues>;

  onSubmit: (data: ExamFormValues) => Promise<void>;

  submitLabel?: string;

  loading?: boolean;
}

export default function ExamForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Exam",
  loading = false,
}: ExamFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExamFormInput>({
    resolver: zodResolver(examSchema),

    defaultValues: {
      examName: initialValues?.examName ?? "",
      examDate: initialValues?.examDate
        ? initialValues.examDate.substring(0, 10)
        : "",
      requiredFaculty: initialValues?.requiredFaculty ?? 1,
    },
  });

  const submit = async (data: ExamFormValues) => {
    try {
      await onSubmit(data);

      reset();
    } catch {
      // Keep values if submission fails.
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <FormField label="Exam Name" required error={errors.examName?.message}>
        <Input
          placeholder="Mid Semester Examination"
          {...register("examName")}
        />
      </FormField>

      <FormField label="Exam Date" required error={errors.examDate?.message}>
        <Input type="date" {...register("examDate")} />
      </FormField>

      <FormField
        label="Required Faculty"
        required
        error={errors.requiredFaculty?.message}
      >
        <Input
          type="number"
          min={1}
          {...register("requiredFaculty", { valueAsNumber: true })}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
