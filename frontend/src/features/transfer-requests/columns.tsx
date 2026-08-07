import type { Column } from "@/components/common/DataTable";

import Button from "@/components/ui/Button";
import StatusBadge from "@/components/common/StatusBadge";

import ReviewTransferRequestDialog from "./dialogs/ReviewTransferRequestDialog";

import type { TransferRequest } from "./types/transferRequest";

interface TransferRequestColumnOptions {
  canApprove: boolean;
  userId?: string;
  setPendingCancel: (request: TransferRequest) => void;
}

export function getTransferRequestColumns({
  canApprove,
  userId,
  setPendingCancel,
}: TransferRequestColumnOptions): Column<TransferRequest>[] {
  return [
    {
      id: "examDutyId",
      key: "examDutyId",
      title: "Exam",
      render: (request) => (
        <div>
          <p>{request.examDuty.exam.examName}</p>

          <p className="text-xs text-muted-foreground">
            {new Date(request.examDuty.exam.examDate).toLocaleDateString()}
          </p>
        </div>
      ),
    },

    {
      id: "fromEmployeeId",
      key: "fromEmployeeId",
      title: "Requested by",
      render: (request) => request.fromEmployee.name,
    },

    {
      id: "createdAt",
      key: "createdAt",
      title: "Requested On",
      render: (request) => new Date(request.createdAt).toLocaleDateString(),
    },

    {
      id: "toEmployeeId",
      key: "toEmployeeId",
      title: "Replacement",
      render: (request) => {
        if (request.toEmployee) {
          return request.toEmployee.name;
        }

        if (request.status === "PENDING") {
          return (
            <span className="text-amber-600 font-medium">
              Pending COE Selection
            </span>
          );
        }

        return "—";
      },
    },

    {
      id: "reason",
      key: "reason",
      title: "Reason",
    },

    {
      id: "status",
      key: "status",
      title: "Status",
      render: (request) => <StatusBadge status={request.status} />,
    },

    {
      id: "actions",
      key: "id",
      title: "Actions",
      align: "right",

      render: (request) => (
        <div className="flex justify-end gap-2">
          {canApprove && request.status === "PENDING" && (
            <>
              <ReviewTransferRequestDialog request={request} action="approve" />

              <ReviewTransferRequestDialog request={request} action="reject" />
            </>
          )}

          {!canApprove &&
            request.status === "PENDING" &&
            request.fromEmployeeId === userId && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setPendingCancel(request)}
              >
                Cancel
              </Button>
            )}
        </div>
      ),
    },
  ];
}
