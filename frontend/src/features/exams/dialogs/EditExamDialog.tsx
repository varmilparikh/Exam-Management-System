import { useState } from "react";

import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

import ExamForm from "../forms/ExamForm";
import { useUpdateExam } from "../hooks/useUpdateExam";

import type { Exam } from "../types/exam";
import type { ExamFormValues } from "../schemas/exam.schema";

interface EditExamDialogProps {
  exam: Exam;
}

export default function EditExamDialog({ exam }: EditExamDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateExam();

  const handleSubmit = async (data: ExamFormValues) => {
    await mutation.mutateAsync({ id: exam.id, data });
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        Edit
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="lg">
          <Dialog.Header
            title="Edit Exam"
            description="Update examination details."
          />

          <Dialog.Body>
            <ExamForm
              initialValues={exam}
              onSubmit={handleSubmit}
              loading={mutation.isPending}
              submitLabel="Update Exam"
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
