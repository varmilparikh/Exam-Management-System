import type { ReactNode } from "react";

interface ToolbarActionsProps {
  children: ReactNode;
}

export default function ToolbarActions({ children }: ToolbarActionsProps) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}
