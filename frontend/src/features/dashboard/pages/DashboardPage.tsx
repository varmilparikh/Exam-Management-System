import { useAuth } from "@/hooks/useAuth";

import CoeDashboard from "./CoeDashboard";
import FacultyDashboard from "./FacultyDashboard";
import HodDashboard from "./HodDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-sm text-gray-500">Loading user information...</div>
      </div>
    );
  }

  switch (user.role) {
    case "FACULTY":
      return <FacultyDashboard />;

    case "HOD":
      return <HodDashboard />;

    case "SUPER_ADMIN":
    case "COE":
      return <CoeDashboard />;

    default:
      return (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Dashboard unavailable
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your account role does not have a configured dashboard.
          </p>
        </div>
      );
  }
}
