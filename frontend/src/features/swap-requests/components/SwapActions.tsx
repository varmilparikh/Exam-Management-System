import AcceptSwapDialog from "../dialogs/AcceptSwapDialog";
import RejectSwapDialog from "../dialogs/RejectSwapDialog";
import ApproveSwapDialog from "../dialogs/ApproveSwapDialog";
import RejectSwapByCoeDialog from "../dialogs/RejectSwapByCoeDialog";
import CancelSwapDialog from "../dialogs/CancelSwapDialog";

import type { SwapRequest } from "../types/swapRequest";

interface SwapActionsProps {
  request: SwapRequest;
  currentUserId: string;
  canApprove: boolean;
}

export default function SwapActions({
  request,
  currentUserId,
  canApprove,
}: SwapActionsProps) {
  const isRequester = request.requesterId === currentUserId;
  const isReceiver = request.receiverId === currentUserId;

  switch (request.status) {
    case "PENDING":
      if (isRequester) {
        return <CancelSwapDialog request={request} />;
      }

      if (isReceiver) {
        return (
          <div className="flex gap-2">
            <AcceptSwapDialog request={request} />
            <RejectSwapDialog request={request} />
          </div>
        );
      }

      return null;

    case "ACCEPTED":
      if (canApprove) {
        return (
          <div className="flex gap-2">
            <ApproveSwapDialog request={request} />
            <RejectSwapByCoeDialog request={request} />
          </div>
        );
      }

      return null;

    default:
      return null;
  }
}
