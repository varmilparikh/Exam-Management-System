import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

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
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 md:static md:z-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile header */}
        <div className="flex h-16 items-center justify-between border-b px-4 md:hidden">
          <div className="font-semibold text-gray-900">Exam Duty</div>

          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop branding */}
        <div className="hidden h-16 items-center border-b px-5 md:flex">
          <span className="text-lg font-bold text-gray-900">Exam Duty</span>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-2 overflow-y-auto p-3"
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
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100",
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User information */}
        {user && (
          <div className="border-t p-3">
            <div className="rounded-lg bg-gray-50 px-3 py-3">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.name}
              </p>

              <p className="mt-1 text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
