import Badge from "@/components/common/Badge";

interface StatusBadgeProps {
  status: string;
}

const statusVariant = {
  ACTIVE: "success",
  INACTIVE: "secondary",

  PENDING: "warning",

  APPROVED: "success",

  REJECTED: "danger",

  CANCELLED: "secondary",

  ACCEPTED: "info",

  UPCOMING: "info",

  COMPLETED: "success",

  ASSIGNED: "info",

  ATTENDED: "success",

  ABSENT: "danger",

  TRANSFERRED: "warning",
} as const;

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant={statusVariant[status as keyof typeof statusVariant] ?? "default"}
    >
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
