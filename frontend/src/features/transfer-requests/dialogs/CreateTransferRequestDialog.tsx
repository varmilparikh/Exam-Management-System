import { useState } from "react";

import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

import TransferRequestForm from "../forms/TransferRequestForm";

import { useCreateTransferRequest } from "../hooks/useTransferRequestActions";

import type { ExamDuty } from "@/features/exam-duties/types/examDuty";

import type { CreateTransferRequestFormValues } from "../schemas/transferRequest.schema";

interface Props {
  examDuty: ExamDuty;
}

export default function CreateTransferRequestDialog({ examDuty }: Props) {
  const [open, setOpen] = useState(false);

  const mutation = useCreateTransferRequest();

  const handleSubmit = async (data: CreateTransferRequestFormValues) => {
    try {
      await mutation.mutateAsync(data);

      setOpen(false);
    } catch {
      // keep dialog open
    }
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Request Transfer
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="lg">
          <Dialog.Header
            title="Request Transfer"
            description={`${examDuty.exam.examName} • ${new Date(
              examDuty.exam.examDate,
            ).toLocaleDateString()}`}
          />

          <Dialog.Body>
            <TransferRequestForm
              examDutyId={examDuty.id}
              onSubmit={handleSubmit}
              loading={mutation.isPending}
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
