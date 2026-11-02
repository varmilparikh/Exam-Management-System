import { useState } from "react";

import Button from "@/components/ui/Button";
import NotificationList from "../components/NotificationList";

import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const markAll = useMarkAllAsRead();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>

          <p className="text-slate-500">View and manage your notifications.</p>
        </div>

        <Button
          loading={markAll.isPending}
          disabled={markAll.isPending}
          onClick={() => markAll.mutate()}
        >
          Mark All as Read
        </Button>
      </div>

      <NotificationList page={page} onPageChange={setPage} />
    </div>
  );
}
