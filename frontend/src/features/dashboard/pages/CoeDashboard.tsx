import {
  Users,
  Building2,
  CalendarDays,
  ClipboardList,
  Repeat,
} from "lucide-react";

import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import UpcomingExamsCard from "../components/UpcomingExamsCard";
import PendingRequestsCard from "../components/PendingRequestsCard";
import RecentActivityCard from "../components/RecentActivityCard";
import NotificationsCard from "../components/NotificationsCard";
import FacultyWorkloadCard from "../components/FacultyWorkloadCard";
import DashboardLoadState from "../components/DashboardLoadState";

import { useCoeDashboard } from "../hooks/useCoeDashboard";

export default function CoeDashboard() {
  const { data, isLoading, refetch } = useCoeDashboard();

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Employees"
          value={data.totalEmployees}
          icon={<Users className="h-6 w-6" />}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Departments"
          value={data.totalDepartments}
          icon={<Building2 className="h-6 w-6" />}
          color="bg-teal-50 text-teal-700"
        />

        <StatCard
          title="Upcoming Exams"
          value={data.totalUpcomingExams}
          icon={<CalendarDays className="h-6 w-6" />}
          color="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Assigned Duties"
          value={data.assignedDuties}
          icon={<ClipboardList className="h-6 w-6" />}
          color="bg-indigo-50 text-indigo-700"
        />

        <StatCard
          title="Faculty opt-ins to review"
          value={data.pendingExamOptIns}
          icon={<CalendarDays className="h-6 w-6" />}
          color="bg-violet-50 text-violet-700"
        />

        <StatCard
          title="Pending Requests"
          value={data.pendingTransferRequests + data.pendingSwapRequests}
          icon={<Repeat className="h-6 w-6" />}
          color="bg-rose-50 text-rose-700"
        />
      </div>

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingExamsCard />
        <PendingRequestsCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivityCard />
        <FacultyWorkloadCard />
      </div>

      <div>
        <NotificationsCard />
      </div>
    </div>
  );
}
