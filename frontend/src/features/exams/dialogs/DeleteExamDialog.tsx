import { useState } from "react";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import Button from "@/components/ui/Button";

import { useDeleteExam } from "../hooks/useDeleteExam";

import type { Exam } from "../types/exam";

interface DeleteExamDialogProps {
  exam: Exam;
}

export default function DeleteExamDialog({ exam }: DeleteExamDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteExam();

  const handleDelete = async () => {
    await mutation.mutateAsync(exam.id);
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Delete
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete Exam"
        description={`Are you sure you want to delete "${exam.examName}"?`}
        confirmText="Delete"
        loading={mutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
