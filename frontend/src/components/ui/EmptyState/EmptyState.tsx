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
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        {icon ?? <Inbox className="h-8 w-8 text-gray-400" />}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}
