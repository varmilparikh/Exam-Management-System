import { Users, ClipboardList, ArrowRightLeft, Repeat } from "lucide-react";

import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import FacultyWorkloadCard from "../components/FacultyWorkloadCard";
import UpcomingExamsCard from "../components/UpcomingExamsCard";
import NotificationsCard from "../components/NotificationsCard";

import { useHodDashboard } from "../hooks/useHodDashboard";

export default function HodDashboard() {
  const { data, isLoading } = useHodDashboard();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Faculty"
          value={data.totalFaculty}
          icon={<Users className="h-6 w-6" />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Upcoming Duties"
          value={data.upcomingDepartmentDuties}
          icon={<ClipboardList className="h-6 w-6" />}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Pending Transfers"
          value={data.pendingTransferRequests}
          icon={<ArrowRightLeft className="h-6 w-6" />}
          color="bg-yellow-100 text-yellow-600"
        />

        <StatCard
          title="Pending Swaps"
          value={data.pendingSwapRequests}
          icon={<Repeat className="h-6 w-6" />}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FacultyWorkloadCard />
        <UpcomingExamsCard />
      </div>

      <NotificationsCard />
    </div>
  );
}
