import { useMemo } from "react";

import DataTable from "@/components/common/DataTable";

import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/permissions/hasPermission";

import { getExamColumns } from "../columns";
import { useExams } from "../hooks/useExams";
import type { ExamFilters } from "../types/examFilters";

interface ExamTableProps {
  filters: ExamFilters;
}

export default function ExamTable({ filters }: ExamTableProps) {
  const { data = [], isLoading, isError, refetch } = useExams(filters);

  const { user } = useAuth();

  const canEdit = hasPermission(user?.role, "exam:edit");
  const canDelete = hasPermission(user?.role, "exam:delete");

  const columns = useMemo(
    () =>
      getExamColumns({
        canEdit,
        canDelete,
      }),
    [canEdit, canDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={isLoading}
      error={isError}
      onRetry={() => void refetch()}
      errorMessage="Exam records could not be retrieved. Check your connection and try again."
      emptyMessage={
        filters.search ? "No matching exams found." : "No exams found."
      }
    />
  );
}
