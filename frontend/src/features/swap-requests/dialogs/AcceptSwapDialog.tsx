import { useState } from "react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { useAcceptSwapRequest } from "../hooks/useAcceptSwapRequest";

import type { SwapRequest } from "../types/swapRequest";

interface AcceptSwapDialogProps {
  request: SwapRequest;
}

export default function AcceptSwapDialog({ request }: AcceptSwapDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation = useAcceptSwapRequest();

  const handleConfirm = async () => {
    await mutation.mutateAsync(request.id);

    setOpen(false);
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Accept
      </Button>

      <ConfirmDialog
        open={open}
        title="Accept Swap Request"
        description="Are you sure you want to accept this swap request? It will be forwarded to the COE for approval."
        confirmText="Accept"
        loading={mutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
