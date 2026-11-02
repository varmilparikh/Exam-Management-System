import { useEffect } from "react";

import Button from "@/components/ui/Button";
import QueryErrorState from "@/components/common/QueryErrorState/QueryErrorState";

import NotificationCard from "./NotificationCard";
import EmptyNotifications from "./EmptyNotifications";
import NotificationSkeleton from "./NotificationSkeleton";

import { useNotifications } from "../hooks/useNotifications";
import { useDeleteNotification } from "../hooks/useDeleteNotification";
import { useMarkAsRead } from "../hooks/useMarkAsRead";

export default function NotificationList({
  page,
  onPageChange,
}: {
  page: number;
  onPageChange: (page: number) => void;
}) {
  const { data, isLoading, isFetching, error, refetch } = useNotifications(page);

  const markAsRead = useMarkAsRead();

  const deleteNotification = useDeleteNotification();

  useEffect(() => {
    const lastPage = data?.pagination.totalPages;
    if (lastPage !== undefined && page > lastPage) {
      onPageChange(lastPage);
    }
  }, [data?.pagination.totalPages, onPageChange, page]);

  if (error) {
    return (
      <QueryErrorState title="Notifications are unavailable" message="Check your connection and try loading them again." onRetry={() => void refetch()} />
    );
  }

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (data?.notifications.length === 0 && page === 1) {
    return <EmptyNotifications />;
  }

  return (
    <div className="space-y-4">
      {data?.notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onRead={(id) => markAsRead.mutate(id)}
          onDelete={(id) => deleteNotification.mutate(id)}
          actionsDisabled={markAsRead.isPending || deleteNotification.isPending}
          readLoading={
            markAsRead.isPending && markAsRead.variables === notification.id
          }
          deleteLoading={
            deleteNotification.isPending &&
            deleteNotification.variables === notification.id
          }
        />
      ))}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-sm text-slate-500">
          {data?.pagination.total ?? 0} notifications · Page {page} of{" "}
          {data?.pagination.totalPages ?? 1}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1 || isFetching}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={!data || page >= data.pagination.totalPages || isFetching}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
