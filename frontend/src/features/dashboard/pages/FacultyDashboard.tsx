import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import FacultyQuickActions from "../components/FacultyQuickActions";
import FacultyDutiesCard from "../components/FacultyDutiesCard";
import NotificationsCard from "../components/NotificationsCard";
import FacultyUpcomingExamOptIns from "@/features/exam-opt-ins/components/FacultyUpcomingExamOptIns";
import DashboardLoadState from "../components/DashboardLoadState";

import { useFacultyDashboard } from "../hooks/useFacultyDashboard";

import {
  ClipboardList,
  CheckCircle,
  ArrowRightLeft,
  Repeat,
  Bell,
  CalendarDays,
} from "lucide-react";

export default function FacultyDashboard() {
  const { data, isLoading, refetch } = useFacultyDashboard();

  if (isLoading || !data) {
    return <DashboardLoadState isLoading={isLoading} onRetry={() => void refetch()} />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Upcoming Duties"
          value={data.myUpcomingDuties}
          icon={<ClipboardList className="h-6 w-6" />}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Completed Duties"
          value={data.completedDuties}
          icon={<CheckCircle className="h-6 w-6" />}
          color="bg-teal-50 text-teal-700"
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

        <StatCard
          title="My pending opt-ins"
          value={data.pendingExamOptIns}
          icon={<CalendarDays className="h-6 w-6" />}
          color="bg-violet-50 text-violet-700"
        />

        <StatCard
          title="Notifications"
          value={data.unreadNotifications}
          icon={<Bell className="h-6 w-6" />}
          color="bg-rose-50 text-rose-700"
        />
      </div>

      <FacultyQuickActions />

      <FacultyUpcomingExamOptIns />

      <div className="grid gap-6 lg:grid-cols-2">
        <FacultyDutiesCard />
        <NotificationsCard />
      </div>
    </div>
  );
}
