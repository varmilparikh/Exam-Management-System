import { useMemo, useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DataTable from "@/components/common/DataTable";
import { useDeleteExamDuty } from "../hooks/useDeleteExamDuty";
import { useUpdateExamDuty } from "../hooks/useUpdateExamDuty";
import { useExamDuties } from "../hooks/useExamDuties";
import type { ExamDuty } from "../types/examDuty";
import { getExamDutyColumns } from "../columns";
import type { ExamDutyFilters } from "../types/examDutyFilters";

interface ExamDutyTableProps {
  filters: ExamDutyFilters;
  canManage: boolean;
}

export default function ExamDutyTable({
  filters,
  canManage,
}: ExamDutyTableProps) {
  const { data = [], isLoading } = useExamDuties(filters);
  const update = useUpdateExamDuty();
  const remove = useDeleteExamDuty();
  const [pendingDelete, setPendingDelete] = useState<ExamDuty | null>(null);
  const columns = useMemo(
    () =>
      getExamDutyColumns({
        canManage,

        updating: update.isPending,

        onDelete: setPendingDelete,

        onStatusChange: (id, status) =>
          update.mutate({
            id,
            status,
          }),
      }),

    [canManage, update],
  );
  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        emptyMessage="No exam duties have been assigned yet."
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove Exam Duty"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.employee.name} from ${pendingDelete.exam.examName}?`
            : ""
        }
        confirmText="Remove"
        loading={remove.isPending}
        onConfirm={async () => {
          if (pendingDelete) {
            await remove.mutateAsync(pendingDelete.id);
            setPendingDelete(null);
          }
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
