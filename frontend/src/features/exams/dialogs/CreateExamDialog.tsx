import { useState } from "react";

import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

import ExamForm from "../forms/ExamForm";
import { useCreateExam } from "../hooks/useCreateExam";

import type { ExamFormValues } from "../schemas/exam.schema";

export default function CreateExamDialog() {
  const [open, setOpen] = useState(false);
  const mutation = useCreateExam();

  const handleSubmit = async (data: ExamFormValues) => {
    await mutation.mutateAsync(data);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Exam</Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="lg">
          <Dialog.Header
            title="Create Exam"
            description="Add a new examination."
          />

          <Dialog.Body>
            <ExamForm
              onSubmit={handleSubmit}
              loading={mutation.isPending}
              submitLabel="Create Exam"
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
