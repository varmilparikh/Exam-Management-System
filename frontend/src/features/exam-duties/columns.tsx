import Badge from "@/components/common/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import type { Column } from "@/components/common/DataTable";

import type { DutyStatus, ExamDuty } from "./types/examDuty";

const statusVariants = {
  ASSIGNED: "info",
  ACCEPTED: "success",
  ATTENDED: "secondary",
  ABSENT: "danger",
} as const;

const statusOptions = Object.keys(statusVariants).map((value) => ({
  value,
  label: value[0] + value.slice(1).toLowerCase(),
}));

interface ExamDutyColumnOptions {
  canManage: boolean;
  updating: boolean;
  onDelete: (duty: ExamDuty) => void;
  onStatusChange: (id: string, status: DutyStatus) => void;
}

export function getExamDutyColumns({
  canManage,
  updating,
  onDelete,
  onStatusChange,
}: ExamDutyColumnOptions): Column<ExamDuty>[] {
  const columns: Column<ExamDuty>[] = [
    {
      id: "examId",
      key: "examId",
      title: "Exam",
      render: (duty) => duty.exam.examName,
    },
    {
      id: "employeeId",
      key: "employeeId",
      title: "Faculty",
      render: (duty) => (
        <div>
          <p>{duty.employee.name}</p>
          <p className="text-xs text-muted-foreground">
            {duty.employee.department.name}
          </p>
        </div>
      ),
    },
    {
      id: "createdAt",
      key: "createdAt",
      title: "Date",
      render: (duty) => new Date(duty.exam.examDate).toLocaleDateString(),
    },
    {
      id: "status",
      key: "status",
      title: "Status",
      render: (duty) =>
        canManage ? (
          <Select
            className="h-8"
            options={statusOptions}
            value={duty.status}
            onChange={(event) =>
              onStatusChange(duty.id, event.target.value as DutyStatus)
            }
            disabled={
              updating || duty.status === "ATTENDED" || duty.status === "ABSENT"
            }
          />
        ) : (
          <Badge variant={statusVariants[duty.status]}>{duty.status}</Badge>
        ),
    },
  ];

  if (canManage) {
    columns.push({
      id: "Actions",
      key: "id",
      title: "Actions",
      align: "right",
      render: (duty) => (
        <Button size="sm" variant="danger" onClick={() => onDelete(duty)}>
          Remove
        </Button>
      ),
    });
  }

  return columns;
}
