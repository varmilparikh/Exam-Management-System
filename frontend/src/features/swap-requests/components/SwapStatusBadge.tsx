import Badge from "@/components/common/Badge";

import type { SwapStatus } from "../types/swapRequest";

interface SwapStatusBadgeProps {
  status: SwapStatus;
}

export default function SwapStatusBadge({ status }: SwapStatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return <Badge variant="warning">Pending</Badge>;

    case "ACCEPTED":
      return <Badge variant="info">Accepted</Badge>;

    case "APPROVED":
      return <Badge variant="success">Approved</Badge>;

    case "REJECTED":
      return <Badge variant="danger">Rejected</Badge>;

    case "CANCELLED":
      return <Badge variant="secondary">Cancelled</Badge>;

    default:
      return <Badge>{status}</Badge>;
  }
}
