import { LogOut, UserCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

import { useLocation } from "react-router-dom";

import { PAGE_TITLES } from "@/constants/page-titles";

export default function Navbar() {
  const { user, logout } = useAuth();

  const { pathname } = useLocation();

  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-gray-500" />

          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>

            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={handleLogout}
          loading={logout.isPending}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
