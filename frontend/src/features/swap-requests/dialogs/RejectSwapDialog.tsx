import { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import { Dialog } from "@/components/ui/Dialog";

import { useRejectSwapRequest } from "../hooks/useRejectSwapRequest";

import type { SwapRequest } from "../types/swapRequest";

interface FormValues {
  reason: string;
}

interface RejectSwapDialogProps {
  request: SwapRequest;
}

export default function RejectSwapDialog({ request }: RejectSwapDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useRejectSwapRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await mutation.mutateAsync({
      id: request.id,
      data,
    });

    reset();
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Reject
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="md">
          <Dialog.Header
            title="Reject Swap Request"
            description="Provide a reason for rejecting this swap request."
          />

          <Dialog.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField label="Reason" error={errors.reason?.message}>
                <Input
                  {...register("reason")}
                  placeholder="Reason for rejection"
                />
              </FormField>

              <Dialog.Footer>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="danger"
                  loading={mutation.isPending}
                >
                  Reject
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
