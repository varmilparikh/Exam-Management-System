import * as RadixDialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";

import type { DialogContentProps } from "./types";

const maxWidthVariants: Record<
  NonNullable<DialogContentProps["maxWidth"]>,
  string
> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  "4xl": "max-w-4xl",
};

export default function DialogContent({
  children,
  maxWidth = "md",
}: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      {/* Overlay */}
      <RadixDialog.Overlay
        className={cn(
          "fixed inset-0 z-50",
          "bg-black/50",
          "backdrop-blur-sm",
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0",
          "data-[state=closed]:fade-out-0",
        )}
      />

      {/* Dialog */}
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50",
          "w-full",
          "mx-4",
          "-translate-x-1/2 -translate-y-1/2",
          "overflow-hidden",
          "rounded-xl",
          "border",
          "bg-white",
          "shadow-xl",
          "max-h-[90vh]",
          "focus-visible:outline-none",
          maxWidthVariants[maxWidth],
        )}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
