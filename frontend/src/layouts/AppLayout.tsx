import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import { Navbar, Sidebar, PageContainer } from "@/components/layout";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop / Mobile Sidebar */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        {/* Mobile menu button */}
        <div className="border-b bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
            Menu
          </button>
        </div>

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
