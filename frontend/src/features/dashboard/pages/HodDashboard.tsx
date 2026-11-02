import { Users, ClipboardList, ArrowRightLeft, Repeat, CalendarDays } from "lucide-react";

import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import FacultyWorkloadCard from "../components/FacultyWorkloadCard";
import UpcomingExamsCard from "../components/UpcomingExamsCard";
import NotificationsCard from "../components/NotificationsCard";
import DashboardLoadState from "../components/DashboardLoadState";

import { useHodDashboard } from "../hooks/useHodDashboard";

export default function HodDashboard() {
  const { data, isLoading, refetch } = useHodDashboard();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <DashboardLoadState isLoading={isLoading} onRetry={() => void refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard
          title="Faculty"
          value={data.totalFaculty}
          icon={<Users className="h-6 w-6" />}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Upcoming Duties"
          value={data.upcomingDepartmentDuties}
          icon={<ClipboardList className="h-6 w-6" />}
          color="bg-teal-50 text-teal-700"
        />

        <StatCard
          title="Department opt-ins"
          value={data.pendingExamOptIns}
          icon={<CalendarDays className="h-6 w-6" />}
          color="bg-violet-50 text-violet-700"
        />

        <StatCard
          title="Pending Transfers"
          value={data.pendingTransferRequests}
          icon={<ArrowRightLeft className="h-6 w-6" />}
          color="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Pending Swaps"
          value={data.pendingSwapRequests}
          icon={<Repeat className="h-6 w-6" />}
          color="bg-indigo-50 text-indigo-700"
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
