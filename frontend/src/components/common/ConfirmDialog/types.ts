import type { ButtonProps } from "@/components/ui/Button";

export interface ConfirmDialogProps {
  open: boolean;

  title: string;

  description: string;

  confirmText?: string;

  cancelText?: string;

  loading?: boolean;

  confirmVariant?: ButtonProps["variant"];

  onConfirm: () => void;

  onCancel: () => void;
}
