import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import {
  useApproveTransferRequest,
  useRejectTransferRequest,
} from "../hooks/useTransferRequestActions";
import type { TransferRequest } from "../types/transferRequest";

interface Values {
  toEmployeeId: string;
  approvalRemark: string;
}
export default function ReviewTransferRequestDialog({
  request,
  action,
}: {
  request: TransferRequest;
  action: "approve" | "reject";
}) {
  const [open, setOpen] = useState(false);
  const approve = useApproveTransferRequest();
  const reject = useRejectTransferRequest();
  const { data: employees = [] } = useEmployees();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      toEmployeeId: request.toEmployeeId ?? "",
      approvalRemark: "",
    },
  });
  const employeeOptions = useMemo(
    () =>
      employees
        .filter(
          (employee) =>
            employee.isActive &&
            employee.role === "FACULTY" &&
            employee.id !== request.fromEmployeeId,
        )
        .map((employee) => ({
          value: employee.id,
          label: `${employee.name} (${employee.employeeCode})`,
        })),
    [employees, request.fromEmployeeId],
  );
  const submit = async (data: Values) => {
    if (action === "approve")
      await approve.mutateAsync({
        id: request.id,
        data: {
          ...(data.toEmployeeId && { toEmployeeId: data.toEmployeeId }),
          ...(data.approvalRemark && { approvalRemark: data.approvalRemark }),
        },
      });
    else
      await reject.mutateAsync({ id: request.id, remark: data.approvalRemark });
    setOpen(false);
  };
  const approving = action === "approve";
  const loading = approving ? approve.isPending : reject.isPending;
  return (
    <>
      <Button
        size="sm"
        variant={approving ? "primary" : "danger"}
        onClick={() => setOpen(true)}
      >
        {approving ? "Approve" : "Reject"}
      </Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="lg">
          <Dialog.Header
            title={
              approving ? "Approve Transfer Request" : "Reject Transfer Request"
            }
            description={
              approving
                ? "Confirm the replacement faculty member."
                : "Provide a clear reason for rejecting this request."
            }
          />
          <Dialog.Body>
            <form onSubmit={handleSubmit(submit)} className="space-y-5">
              {approving && (
                <FormField
                  label="Replacement faculty"
                  required
                  error={errors.toEmployeeId?.message}
                >
                  <Select
                    options={employeeOptions}
                    placeholder="Select replacement"
                    {...register("toEmployeeId", {
                      required: request.toEmployeeId
                        ? false
                        : "A replacement is required.",
                    })}
                  />
                </FormField>
              )}
              <FormField
                label={approving ? "Approval note" : "Rejection reason"}
                required={!approving}
                error={errors.approvalRemark?.message}
              >
                <textarea
                  className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  {...register("approvalRemark", {
                    required: !approving ? "A reason is required." : false,
                    minLength: !approving
                      ? { value: 5, message: "Use at least 5 characters." }
                      : undefined,
                    maxLength: 500,
                  })}
                />
              </FormField>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant={approving ? "primary" : "danger"}
                  loading={loading}
                >
                  {approving ? "Approve Request" : "Reject Request"}
                </Button>
              </div>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
