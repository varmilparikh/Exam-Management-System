import type { ReactNode } from "react";

export interface DialogRootProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export interface DialogContentProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export interface DialogHeaderProps {
  title: string;

  description?: string;

  showCloseButton?: boolean;

  className?: string;
}

export interface DialogBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}
