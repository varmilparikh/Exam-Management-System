import { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";

import { useRejectSwapByCoe } from "../hooks/useRejectSwapByCoe";

import type { SwapRequest } from "../types/swapRequest";

interface FormValues {
  approvalRemark: string;
}

interface RejectSwapByCoeDialogProps {
  request: SwapRequest;
}

export default function RejectSwapByCoeDialog({
  request,
}: RejectSwapByCoeDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useRejectSwapByCoe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      approvalRemark: "",
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
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Reject
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="md">
          <Dialog.Header
            title="Reject Swap Request"
            description="Provide a reason before rejecting this swap request."
          />

          <Dialog.Body>
            <form onSubmit={handleSubmit(submit)} className="space-y-5">
              <FormField
                label="Approval Remark"
                error={errors.approvalRemark?.message}
              >
                <Input
                  placeholder="Reason for rejection..."
                  {...register("approvalRemark")}
                />
              </FormField>

              <Dialog.Footer>
                <Button
                  type="button"
                  variant="secondary"
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
