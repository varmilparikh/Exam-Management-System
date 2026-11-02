import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/common/Avatar";
import { CalendarDays } from "lucide-react";

export default function DashboardHeader() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="relative flex min-h-40 items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#122238] via-[#183756] to-[#1e4b70] px-5 py-6 text-white shadow-[0_14px_32px_rgba(18,34,56,0.16)] sm:px-8 sm:py-7">
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-28 h-72 w-72 rounded-full border border-white/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-16 h-52 w-52 rounded-full border border-white/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-36 w-64 bg-[radial-gradient(ellipse_at_bottom_right,rgba(45,212,191,0.15),transparent_70%)]" />

      <div className="relative z-10 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">{greeting}</p>
        <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight sm:text-3xl">{user?.name}</h1>
        <p className="mt-1 text-sm text-blue-100/70">{user?.designation || "Your examination workspace"}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-xs text-blue-100/60">
          <CalendarDays className="h-3.5 w-3.5" />
          {dateLabel}
        </p>
      </div>

      <div className="relative z-10 ml-4 hidden rounded-full border border-white/20 bg-white/10 p-1.5 shadow-lg shadow-slate-950/10 sm:block">
        <Avatar name={user?.name ?? ""} src={user?.profileImage} size="lg" className="border-white/20" />
      </div>
    </div>
  );
}
