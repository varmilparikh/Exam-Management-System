import Badge from "@/components/common/Badge";
import type { Column } from "@/components/common/DataTable";

import type { ExamDuty } from "./types/examDuty";
import CreateTransferRequestDialog from "../transfer-requests/dialogs/CreateTransferRequestDialog";
import CreateSwapRequestDialog from "@/features/swap-requests/dialogs/CreateSwapRequestDialog";

const statusVariants = {
  ASSIGNED: "info",
  ACCEPTED: "success",
  ATTENDED: "secondary",
  ABSENT: "danger",
} as const;

export function getMyExamDutyColumns(): Column<ExamDuty>[] {
  return [
    {
      id: "exam",
      key: "examId",
      title: "Exam",
      render: (duty) => duty.exam.examName,
    },

    {
      id: "date",
      key: "examId",
      title: "Exam Date",
      render: (duty) => new Date(duty.exam.examDate).toLocaleDateString(),
    },

    {
      id: "status",
      key: "status",
      title: "Status",
      render: (duty) => (
        <Badge variant={statusVariants[duty.status]}>{duty.status}</Badge>
      ),
    },

    {
      id: "actions",
      title: "Actions",
      render: (duty) => (
        <div className="flex gap-2">
          <CreateTransferRequestDialog examDuty={duty} />
          <CreateSwapRequestDialog examDuty={duty} />
        </div>
      ),
    },
  ];
}
