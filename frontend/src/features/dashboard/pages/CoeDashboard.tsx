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

import { useCoeDashboard } from "../hooks/useCoeDashboard";

export default function CoeDashboard() {
  const { data, isLoading } = useCoeDashboard();

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

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Employees"
          value={data.totalEmployees}
          icon={<Users className="h-6 w-6" />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Departments"
          value={data.totalDepartments}
          icon={<Building2 className="h-6 w-6" />}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Upcoming Exams"
          value={data.totalUpcomingExams}
          icon={<CalendarDays className="h-6 w-6" />}
          color="bg-yellow-100 text-yellow-600"
        />

        <StatCard
          title="Assigned Duties"
          value={data.assignedDuties}
          icon={<ClipboardList className="h-6 w-6" />}
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Pending Requests"
          value={data.pendingTransferRequests + data.pendingSwapRequests}
          icon={<Repeat className="h-6 w-6" />}
          color="bg-red-100 text-red-600"
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
