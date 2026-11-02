import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

interface QueryErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
  compact?: boolean;
}

export default function QueryErrorState({
  title,
  message,
  onRetry,
  compact = false,
}: QueryErrorStateProps) {
  return (
    <section
      className={`flex flex-col items-center justify-center px-5 text-center ${compact ? "py-7" : "min-h-56 rounded-2xl border border-rose-200/80 bg-white py-10 shadow-sm"}`}
      role="alert"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
      </span>
      <h2 className="mt-3 text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        Try again
      </Button>
    </section>
  );
}
