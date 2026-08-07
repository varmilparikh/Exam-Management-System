import Badge from "@/components/common/Badge";

interface StatusChipProps {
  status: string;
}

export default function StatusChip({ status }: StatusChipProps) {
  const variant =
    status === "APPROVED" || status === "ATTENDED" || status === "COMPLETED"
      ? "success"
      : status === "PENDING"
        ? "warning"
        : status === "REJECTED" || status === "CANCELLED"
          ? "danger"
          : status === "ACTIVE"
            ? "info"
            : "secondary";

  return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>;
}
