import type { Column } from "@/components/common/DataTable";

import type { SwapRequest } from "./types/swapRequest";

import SwapStatusBadge from "./components/SwapStatusBadge";
import SwapActions from "./components/SwapActions";

interface SwapRequestColumnOptions {
  canApprove: boolean;
  currentUserId: string;
}

export function getSwapRequestColumns({
  canApprove,
  currentUserId,
}: SwapRequestColumnOptions): Column<SwapRequest>[] {
  return [
    {
      id: "requester",
      key: "requester",
      title: "Requester",
      render: (request) => request.requester.name,
    },
    {
      id: "receiver",
      key: "receiver",
      title: "Receiver",
      render: (request) => request.receiver.name,
    },
    {
      id: "requesterDuty",
      key: "requesterDuty",
      title: "Requester Exam",
      render: (request) => request.requesterDuty.exam.examName,
    },
    {
      id: "receiverDuty",
      key: "receiverDuty",
      title: "Receiver Exam",
      render: (request) => request.receiverDuty.exam.examName,
    },
    {
      id: "status",
      key: "status",
      title: "Status",
      render: (request) => <SwapStatusBadge status={request.status} />,
    },
    {
      id: "actions",
      key: "id",
      title: "Actions",
      render: (request) => (
        <SwapActions
          request={request}
          canApprove={canApprove}
          currentUserId={currentUserId}
        />
      ),
    },
    {
      id: "createdAt",
      key: "createdAt",
      title: "Requested On",
      render: (request) => new Date(request.createdAt).toLocaleDateString(),
    },
  ];
}
