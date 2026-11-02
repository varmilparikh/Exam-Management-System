import { NavLink } from "react-router-dom";
import { ClipboardCheck, X } from "lucide-react";

import { getNavigation } from "@/permissions";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const { user } = useAuth();

  const navigation = getNavigation(user?.role);
  const roleLabel =
    user?.role === "SUPER_ADMIN"
      ? "Super administrator"
      : user?.role === "COE"
        ? "Controller of Examinations"
        : user?.role === "HOD"
          ? "Head of Department"
          : "Faculty";

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#122238] text-white shadow-2xl shadow-slate-950/10 transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 md:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-950/20">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <span className="font-semibold tracking-tight text-white">Exam Duty</span>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop branding */}
        <div className="hidden h-[76px] items-center border-b border-white/10 px-5 md:flex">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-950/30">
            <ClipboardCheck className="h-5 w-5" />
          </span>
          <span className="ml-3 leading-tight">
            <span className="block text-[15px] font-semibold tracking-wide text-white">Exam Duty</span>
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Management system</span>
          </span>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300",
                    isActive
                      ? "bg-teal-300/10 text-teal-100 shadow-sm ring-1 ring-inset ring-teal-200/15 before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-full before:bg-teal-300"
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors", isActive ? "text-teal-200" : "text-slate-400 group-hover:text-slate-200")} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User information */}
        {user && (
          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-700 text-sm font-semibold text-teal-200">
                {user.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">{user.name}</span>
                <span className="mt-0.5 block truncate text-[11px] text-slate-400">{roleLabel}</span>
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
