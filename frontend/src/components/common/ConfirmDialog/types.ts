export interface ConfirmDialogProps {
  open: boolean;

  title: string;

  description: string;

  confirmText?: string;

  cancelText?: string;

  loading?: boolean;

  onConfirm: () => void;

  onCancel: () => void;
}
