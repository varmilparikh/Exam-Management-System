import { LogOut } from "lucide-react";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/common/Avatar";

import { useLocation } from "react-router-dom";

import { PAGE_TITLES } from "@/constants/page-titles";

export default function Navbar() {
  const { user, logout } = useAuth();

  const { pathname } = useLocation();

  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  const roleLabel =
    user?.role === "SUPER_ADMIN"
      ? "Super administrator"
      : user?.role === "COE"
        ? "Controller of Examinations"
        : user?.role === "HOD"
          ? "Head of Department"
          : "Faculty";

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] backdrop-blur sm:px-6">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{pageTitle}</h2>
        <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">Examination duty workspace</p>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2.5 sm:flex">
          <Avatar name={user?.name ?? ""} src={user?.profileImage} size="sm" className="border-slate-200 bg-blue-600" />
          <div className="flex min-w-0 flex-col">
            <span className="max-w-40 truncate text-sm font-semibold text-slate-800">{user?.name}</span>
            <span className="text-[11px] text-slate-500">{roleLabel}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          loading={logout.isPending}
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </Button>
      </div>
    </header>
  );
}
