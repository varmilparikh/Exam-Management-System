import { History } from "lucide-react";

import DashboardCard from "@/components/ui/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

import { useRecentActivities } from "../hooks/useRecentActivities";

export default function RecentActivityCard() {
  const { data: activities = [], isLoading } = useRecentActivities();

  if (isLoading) {
    return (
      <DashboardCard
        title="Recent Activities"
        icon={<History className="h-5 w-5 text-purple-600" />}
      >
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </DashboardCard>
    );
  }

  if (activities.length === 0) {
    return (
      <DashboardCard
        title="Recent Activities"
        icon={<History className="h-5 w-5 text-purple-600" />}
      >
        <EmptyState
          title="No Recent Activities"
          description="Activity logs will appear here."
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Recent Activities"
      icon={<History className="h-5 w-5 text-purple-600" />}
    >
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border-b pb-3 last:border-none last:pb-0"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{activity.employee.name}</p>

              <span className="text-xs text-gray-500">
                {new Date(activity.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-blue-600">
              {activity.action}
            </p>

            <p className="text-sm text-gray-600">{activity.description}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
