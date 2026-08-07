import { type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  description?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "bg-blue-100 text-blue-600",
  description,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
        transition-all
        hover:shadow-md
      "
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}
        >
          {icon}
        </div>

        {onClick && <ArrowUpRight className="h-5 w-5 text-gray-400" />}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>

        <p className="mt-2 text-3xl font-bold">{value}</p>

        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}
