import Button from "@/components/ui/Button";

import NotificationList from "../components/NotificationList";

import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";

export default function NotificationsPage() {
  const markAll = useMarkAllAsRead();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>

          <p className="text-gray-500">View and manage your notifications.</p>
        </div>

        <Button onClick={() => markAll.mutate()}>Mark All as Read</Button>
      </div>

      <NotificationList />
    </div>
  );
}
