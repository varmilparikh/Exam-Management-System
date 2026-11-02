import { ClipboardList } from "lucide-react";

import DashboardCard from "@/components/ui/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import StatusChip from "@/components/ui/StatusChip";

import { useMyUpcomingDuties } from "@/features/exam-duties/hooks/useMyUpcomingDuties";

export default function FacultyDutiesCard() {
  const { data: duties = [], isLoading } = useMyUpcomingDuties();

  if (isLoading) {
    return (
      <DashboardCard
        title="Upcoming Duties"
        icon={<ClipboardList className="h-5 w-5 text-blue-600" />}
      >
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </DashboardCard>
    );
  }

  if (duties.length === 0) {
    return (
      <DashboardCard
        title="Upcoming Duties"
        icon={<ClipboardList className="h-5 w-5 text-blue-600" />}
      >
        <EmptyState
          title="No Upcoming Duties"
          description="You don't have any upcoming examination duties."
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Upcoming Duties"
      icon={<ClipboardList className="h-5 w-5 text-blue-600" />}
    >
      <div className="space-y-4">
        {duties.map((duty) => (
          <div
            key={duty.id}
            className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50/70"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{duty.exam.examName}</h3>

              <StatusChip status={duty.status} />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {new Date(duty.exam.examDate).toLocaleDateString()}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Required Faculty: {duty.exam.requiredFaculty}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
