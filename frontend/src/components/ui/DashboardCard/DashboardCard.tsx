import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  icon,
  children,
  className,
  action,
  footer,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          {icon}

          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{title}</h2>
        </div>

        {action}
      </div>

      <div className="p-5 sm:p-6">{children}</div>

      {footer && <div className="border-t border-slate-100 px-5 py-3 sm:px-6">{footer}</div>}
    </div>
  );
}
