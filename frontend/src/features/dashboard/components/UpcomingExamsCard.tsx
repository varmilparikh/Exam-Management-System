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
      title="Upcoming Exams"
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
          title="No Upcoming Exams"
          description="There are no scheduled upcoming examinations."
        />
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-lg border p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{exam.examName}</h3>

                <StatusChip status={exam.status} />
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(exam.examDate).toLocaleDateString()}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Required Faculty: {exam.requiredFaculty}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
