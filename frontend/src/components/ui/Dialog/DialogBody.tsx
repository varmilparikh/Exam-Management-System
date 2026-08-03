import { cn } from "@/lib/utils";

import type { DialogBodyProps } from "./types";

export default function DialogBody({ children, className }: DialogBodyProps) {
  return <div className={cn("p-6 overflow-y-auto", className)}>{children}</div>;
}
