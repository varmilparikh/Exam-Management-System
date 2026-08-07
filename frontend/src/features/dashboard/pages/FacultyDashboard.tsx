import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import FacultyQuickActions from "../components/FacultyQuickActions";
import FacultyDutiesCard from "../components/FacultyDutiesCard";
import NotificationsCard from "../components/NotificationsCard";

import { useFacultyDashboard } from "../hooks/useFacultyDashboard";

import {
  ClipboardList,
  CheckCircle,
  ArrowRightLeft,
  Repeat,
  Bell,
} from "lucide-react";

export default function FacultyDashboard() {
  const { data, isLoading } = useFacultyDashboard();

  if (isLoading || !data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Upcoming Duties"
          value={data.myUpcomingDuties}
          icon={<ClipboardList className="h-6 w-6" />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Completed Duties"
          value={data.completedDuties}
          icon={<CheckCircle className="h-6 w-6" />}
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

        <StatCard
          title="Notifications"
          value={data.unreadNotifications}
          icon={<Bell className="h-6 w-6" />}
          color="bg-red-100 text-red-600"
        />
      </div>

      <FacultyQuickActions />

      <div className="grid gap-6 lg:grid-cols-2">
        <FacultyDutiesCard />
        <NotificationsCard />
      </div>
    </div>
  );
}
