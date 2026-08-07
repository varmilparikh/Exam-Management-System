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
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          {icon}

          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {action}
      </div>

      <div className="p-6">{children}</div>

      {footer && <div className="border-t px-6 py-3">{footer}</div>}
    </div>
  );
}
