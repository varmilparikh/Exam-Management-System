import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface DashboardLoadStateProps {
  isLoading: boolean;
  onRetry: () => void;
}

export default function DashboardLoadState({
  isLoading,
  onRetry,
}: DashboardLoadStateProps) {
  if (isLoading) {
    return (
      <div
        className="flex min-h-44 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-500 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <Spinner />
        Loading your dashboard…
      </div>
    );
  }

  return (
    <section
      className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-rose-200/80 bg-white px-6 py-10 text-center shadow-sm"
      role="alert"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
        <RefreshCw className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-slate-900">
        We couldn’t load your dashboard
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Check your connection, then try again.
      </p>
      <Button variant="outline" className="mt-5" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </section>
  );
}
