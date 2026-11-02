import { CalendarDays } from "lucide-react";

import DashboardCard from "@/components/ui/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";

import { useUpcomingExams } from "../hooks/useUpcomingExams";
import Skeleton from "@/components/ui/Skeleton/Skeleton";

export default function UpcomingExamsCard() {
  const { data: exams = [], isLoading } = useUpcomingExams();

  return (
    <DashboardCard
      title="Upcoming exam sessions"
      icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : exams.length === 0 ? (
        <EmptyState
        title="No upcoming exam sessions"
          description="There are no scheduled upcoming examinations."
        />
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50/70"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{exam.examName}</h3>

                <StatusChip status={exam.status} />
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {new Date(exam.examDate).toLocaleDateString()}
                {` · ${exam.sessionName} · ${formatTime(exam.startTime)}–${formatTime(exam.endTime)}`}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Required Faculty: {exam.requiredFaculty}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
}
