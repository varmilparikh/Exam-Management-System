import { Users } from "lucide-react";

import DashboardCard from "@/components/ui/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

import { useFacultyWorkload } from "../hooks/useFacultyWorkload";

export default function FacultyWorkloadCard() {
  const { data: workload = [], isLoading } = useFacultyWorkload();

  if (isLoading) {
    return (
      <DashboardCard
        title="Faculty Workload"
        icon={<Users className="h-5 w-5 text-green-600" />}
      >
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </DashboardCard>
    );
  }

  if (workload.length === 0) {
    return (
      <DashboardCard
        title="Faculty Workload"
        icon={<Users className="h-5 w-5 text-green-600" />}
      >
        <EmptyState
          title="No Faculty Data"
          description="Faculty workload information is unavailable."
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Faculty Workload"
      icon={<Users className="h-5 w-5 text-green-600" />}
    >
      <div className="space-y-4">
        {workload.map((faculty) => (
          <div
            key={faculty.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-semibold">{faculty.name}</p>

              <p className="text-sm text-gray-500">{faculty.employeeCode}</p>

              <p className="text-sm text-gray-500">{faculty.designation}</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">{faculty.attendedCount}</p>

              <p className="text-xs text-gray-500">Duties Attended</p>

              <p className="mt-1 text-xs text-gray-400">
                Avg: {faculty.averageDuty}
              </p>

              <p className="text-xs text-gray-400">
                Transfers: {faculty.transferCount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
