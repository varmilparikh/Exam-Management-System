import { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";

import { useApproveSwapRequest } from "../hooks/useApproveSwapRequest";

import type { SwapRequest } from "../types/swapRequest";

interface FormValues {
  approvalRemark: string;
}

interface ApproveSwapDialogProps {
  request: SwapRequest;
}

export default function ApproveSwapDialog({ request }: ApproveSwapDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useApproveSwapRequest();

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
      <Button size="sm" onClick={() => setOpen(true)}>
        Approve
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="md">
          <Dialog.Header
            title="Approve Swap Request"
            description="Provide an approval remark before approving this request."
          />

          <Dialog.Body>
            <form onSubmit={handleSubmit(submit)} className="space-y-5">
              <FormField
                label="Approval Remark"
                error={errors.approvalRemark?.message}
              >
                <Input
                  placeholder="Approved after verification..."
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

                <Button type="submit" loading={mutation.isPending}>
                  Approve
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
