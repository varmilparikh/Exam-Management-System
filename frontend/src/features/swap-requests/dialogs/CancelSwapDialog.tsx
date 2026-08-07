import { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";

import { useCancelSwapRequest } from "../hooks/useCancelSwapRequest";

import type { SwapRequest } from "../types/swapRequest";

interface FormValues {
  reason: string;
}

interface CancelSwapDialogProps {
  request: SwapRequest;
}

export default function CancelSwapDialog({ request }: CancelSwapDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useCancelSwapRequest();

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

  const submit = async (data: FormValues) => {
    await mutation.mutateAsync({
      id: request.id,
      data,
    });

    reset();
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        Cancel
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="md">
          <Dialog.Header
            title="Cancel Swap Request"
            description="Optionally provide a reason before cancelling this request."
          />

          <Dialog.Body>
            <form onSubmit={handleSubmit(submit)} className="space-y-5">
              <FormField label="Reason" error={errors.reason?.message}>
                <Input
                  placeholder="Reason (optional)"
                  {...register("reason")}
                />
              </FormField>

              <Dialog.Footer>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>

                <Button type="submit" loading={mutation.isPending}>
                  Cancel Request
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
