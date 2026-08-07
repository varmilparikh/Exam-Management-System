import { useMemo, useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DataTable from "@/components/common/DataTable";
import { useCancelTransferRequest } from "../hooks/useTransferRequestActions";
import { useTransferRequests } from "../hooks/useTransferRequests";
import type { TransferRequest } from "../types/transferRequest";
import type { TransferRequestFilters } from "../types/transferRequestFilters";
import { getTransferRequestColumns } from "../columns";

interface TransferRequestTableProps {
  filters: TransferRequestFilters;
  canApprove: boolean;
  userId?: string;
}

export default function TransferRequestTable({
  filters,
  canApprove,
  userId,
}: TransferRequestTableProps) {
  const { data = [], isLoading } = useTransferRequests(canApprove, filters);
  const cancel = useCancelTransferRequest();
  const [pendingCancel, setPendingCancel] = useState<TransferRequest | null>(
    null,
  );
  const columns = useMemo(
    () =>
      getTransferRequestColumns({
        canApprove,
        userId,
        setPendingCancel,
      }),

    [canApprove, userId],
  );
  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        emptyMessage="No transfer requests found."
      />
      <ConfirmDialog
        open={Boolean(pendingCancel)}
        title="Cancel Transfer Request"
        description="Cancel this pending transfer request?"
        confirmText="Cancel Request"
        loading={cancel.isPending}
        onConfirm={async () => {
          if (pendingCancel) {
            await cancel.mutateAsync(pendingCancel.id);
            setPendingCancel(null);
          }
        }}
        onCancel={() => setPendingCancel(null)}
      />
    </>
  );
}
