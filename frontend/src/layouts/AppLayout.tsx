import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import { Navbar, Sidebar, PageContainer } from "@/components/layout";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f3f6fb]">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-xl bg-white px-4 py-2 font-semibold text-blue-800 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      {/* Desktop / Mobile Sidebar */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        {/* Mobile menu button */}
        <div className="border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
