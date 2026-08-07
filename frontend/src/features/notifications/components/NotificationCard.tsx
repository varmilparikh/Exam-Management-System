import { Bell, Check, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";

import type { Notification } from "../types/notification";

interface NotificationCardProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationCard({
  notification,
  onRead,
  onDelete,
}: NotificationCardProps) {
  return (
    <div
      className={`
        rounded-lg
        border
        p-5
        transition
        hover:shadow-sm
        ${notification.isRead ? "bg-white" : "bg-blue-50"}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <Bell className="mt-1 h-5 w-5 text-blue-600" />

          <div>
            <h3 className="font-semibold">{notification.title}</h3>

            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>

            <p className="mt-2 text-xs text-gray-400">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!notification.isRead && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRead(notification.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
