import type { ReactNode } from "react";

import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export default function EmptyState({
  title = "Nothing here",
  description = "No data available.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {icon ?? <Inbox className="h-8 w-8 text-slate-400" />}
      </div>

      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
