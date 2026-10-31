import AcceptSwapDialog from "../dialogs/AcceptSwapDialog";
import RejectSwapDialog from "../dialogs/RejectSwapDialog";
import CancelSwapDialog from "../dialogs/CancelSwapDialog";

import type { SwapRequest } from "../types/swapRequest";

interface SwapActionsProps {
  request: SwapRequest;
  currentUserId: string;
}

export default function SwapActions({
  request,
  currentUserId,
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
      return isReceiver ? <AcceptSwapDialog request={request} /> : null;

    default:
      return null;
  }
}
