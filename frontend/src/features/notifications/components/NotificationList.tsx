import NotificationCard from "./NotificationCard";
import EmptyNotifications from "./EmptyNotifications";
import NotificationSkeleton from "./NotificationSkeleton";

import { useNotifications } from "../hooks/useNotifications";
import { useDeleteNotification } from "../hooks/useDeleteNotification";
import { useMarkAsRead } from "../hooks/useMarkAsRead";

export default function NotificationList() {
  const { data = [], isLoading } = useNotifications();

  const markAsRead = useMarkAsRead();

  const deleteNotification = useDeleteNotification();

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (data.length === 0) {
    return <EmptyNotifications />;
  }

  return (
    <div className="space-y-4">
      {data.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onRead={(id) => markAsRead.mutate(id)}
          onDelete={(id) => deleteNotification.mutate(id)}
        />
      ))}
    </div>
  );
}
