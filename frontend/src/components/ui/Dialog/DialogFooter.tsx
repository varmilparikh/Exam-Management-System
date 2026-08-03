import { cn } from "@/lib/utils";

import type { DialogFooterProps } from "./types";

export default function DialogFooter({
  children,
  className,
}: DialogFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
