import type { ReactNode } from "react";

interface ToolbarProps {
  children: ReactNode;
}

export default function Toolbar({ children }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)] md:flex-row md:items-center md:justify-between">
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
}

export function ToolbarLeft({ children }: SectionProps) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-3">{children}</div>
  );
}

export function ToolbarRight({ children }: SectionProps) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}
