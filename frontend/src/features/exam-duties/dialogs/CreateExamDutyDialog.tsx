import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import { useExams } from "@/features/exams/hooks/useExams";
import { useCreateExamDuty } from "../hooks/useCreateExamDuty";

interface Values {
  employeeId: string;
  examId: string;
}
export default function CreateExamDutyDialog() {
  const [open, setOpen] = useState(false);
  const { data: employees = [] } = useEmployees();
  const { data: exams = [] } = useExams({
    search: "",
    status: "",
  });
  const mutation = useCreateExamDuty();
  const { register, handleSubmit, reset } = useForm<Values>();
  const employeeOptions = useMemo(
    () =>
      employees
        .filter((employee) => employee.isActive)
        .map((employee) => ({
          value: employee.id,
          label: `${employee.name} (${employee.employeeCode})`,
        })),
    [employees],
  );
  const examOptions = useMemo(
    () =>
      exams
        .filter((exam) => exam.status === "UPCOMING")
        .map((exam) => ({
          value: exam.id,
          label: `${exam.examName} — ${new Date(exam.examDate).toLocaleDateString()}`,
        })),
    [exams],
  );
  const submit = async (data: Values) => {
    await mutation.mutateAsync(data);
    reset();
    setOpen(false);
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Assign Duty</Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="lg">
          <Dialog.Header
            title="Assign Exam Duty"
            description="Assign an upcoming examination to a faculty member."
          />
          <Dialog.Body>
            <form onSubmit={handleSubmit(submit)} className="space-y-6">
              <FormField label="Exam" required>
                <Select
                  options={examOptions}
                  placeholder="Select exam"
                  {...register("examId", { required: true })}
                />
              </FormField>
              <FormField label="Faculty member" required>
                <Select
                  options={employeeOptions}
                  placeholder="Select employee"
                  {...register("employeeId", { required: true })}
                />
              </FormField>
              <div className="flex justify-end">
                <Button type="submit" loading={mutation.isPending}>
                  Assign Duty
                </Button>
              </div>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
