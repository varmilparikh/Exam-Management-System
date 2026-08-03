import { Dialog } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

import type { ConfirmDialogProps } from "./types";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <Dialog.Content maxWidth="sm">
        <Dialog.Header title={title} description={description} />

        <Dialog.Footer>
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>

          <Button variant="danger" loading={loading} onClick={onConfirm}>
            {confirmText}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
