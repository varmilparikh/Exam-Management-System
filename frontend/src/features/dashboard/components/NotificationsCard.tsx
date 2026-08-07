import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardCard from "@/components/ui/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

import { ROUTES } from "@/constants/routes";

import { useUnreadNotifications } from "@/features/notifications/hooks/useUnreadNotifications";

export default function NotificationsCard() {
  const { data: notifications = [], isLoading } = useUnreadNotifications();

  if (isLoading) {
    return (
      <DashboardCard
        title="Notifications"
        icon={<Bell className="h-5 w-5 text-yellow-600" />}
      >
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </DashboardCard>
    );
  }

  if (notifications.length === 0) {
    return (
      <DashboardCard
        title="Notifications"
        icon={<Bell className="h-5 w-5 text-yellow-600" />}
      >
        <EmptyState
          title="No Notifications"
          description="You're all caught up."
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Notifications"
      icon={<Bell className="h-5 w-5 text-yellow-600" />}
    >
      <div className="space-y-4">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className="border-b pb-3 last:border-none last:pb-0"
          >
            <h3 className="font-medium">{notification.title}</h3>

            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>

            <p className="mt-2 text-xs text-gray-400">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        <div className="pt-2">
          <Link to={ROUTES.NOTIFICATIONS}>
            <Button variant="outline" className="w-full">
              View All Notifications
            </Button>
          </Link>
        </div>
      </div>
    </DashboardCard>
  );
}
