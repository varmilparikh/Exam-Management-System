import type { Column } from "@/components/common/DataTable";

import DeleteExamDialog from "./dialogs/DeleteExamDialog";
import EditExamDialog from "./dialogs/EditExamDialog";

import type { Exam } from "./types/exam";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";

function formatExamDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}

interface ExamColumnOptions {
  canEdit: boolean;
  canDelete: boolean;
}

export function getExamColumns({
  canEdit,
  canDelete,
}: ExamColumnOptions): Column<Exam>[] {
  const columns: Column<Exam>[] = [
    {
      id: "examName",
      key: "examName",
      title: "Exam Name",
    },
    {
      id: "examDate",
      key: "examDate",
      title: "Date",
      render: (exam) => formatExamDate(exam.examDate),
    },
    {
      id: "requiredFaculty",
      key: "requiredFaculty",
      title: "Required Faculty",
      align: "center",
    },
    {
      id: "status",
      key: "status",
      title: "Status",
      render: (exam) => <StatusBadge status={exam.status} />,
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      id: "actions",
      key: "id",
      title: "Actions",
      align: "right",
      render: (exam) => (
        <div className="flex justify-end gap-2">
          {canEdit && <EditExamDialog exam={exam} />}

          {canDelete && <DeleteExamDialog exam={exam} />}
        </div>
      ),
    });
  }

  return columns;
}
