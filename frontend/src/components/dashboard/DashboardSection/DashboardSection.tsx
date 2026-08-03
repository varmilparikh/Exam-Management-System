import type { ReactNode } from "react";

import { Card } from "@/components/common";

interface DashboardSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function DashboardSection({
  title,
  action,
  children,
}: DashboardSectionProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </Card>
  );
}