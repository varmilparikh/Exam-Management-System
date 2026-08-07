import { useState } from "react";

import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

import SwapRequestForm from "../forms/SwapRequestForm";
import { useCreateSwapRequest } from "../hooks/useCreateSwapRequest";

import type { CreateSwapRequestDto } from "../api/swapRequest.service";
import type { ExamDuty } from "@/features/exam-duties/types/examDuty";

interface Props {
  examDuty: ExamDuty;
}

export default function CreateSwapRequestDialog({ examDuty }: Props) {
  const [open, setOpen] = useState(false);

  const mutation = useCreateSwapRequest();

  const handleSubmit = async (data: CreateSwapRequestDto) => {
    await mutation.mutateAsync(data);
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Swap
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="xl">
          <Dialog.Header
            title="Request Duty Swap"
            description={`${examDuty.exam.examName} • ${new Date(
              examDuty.exam.examDate,
            ).toLocaleDateString()}`}
          />

          <Dialog.Body>
            <SwapRequestForm
              requesterDutyId={examDuty.id}
              onSubmit={handleSubmit}
              loading={mutation.isPending}
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
