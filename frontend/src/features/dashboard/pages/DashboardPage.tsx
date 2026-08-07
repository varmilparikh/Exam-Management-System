import { useAuth } from "@/hooks/useAuth";

import CoeDashboard from "./CoeDashboard";
import FacultyDashboard from "./FacultyDashboard";
import HodDashboard from "./HodDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case "FACULTY":
      return <FacultyDashboard />;

    case "HOD":
      return <HodDashboard />;

    case "SUPER_ADMIN":
    case "COE":
    default:
      return <CoeDashboard />;
  }
}
