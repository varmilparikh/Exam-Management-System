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
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
        >
          <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        </div>

        {onClick && <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />}
      </div>

      <div className="mt-4">
        <h3 className="text-[13px] font-medium leading-5 text-slate-500">{title}</h3>

        <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>

        {description && (
          <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
        )}
      </div>
    </>
  );

  const className = "group w-full rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_6px_20px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:p-5";

  return onClick ? (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}
