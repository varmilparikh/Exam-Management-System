import { Outlet } from "react-router-dom";

import { Navbar, Sidebar, PageContainer } from "@/components/layout";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
