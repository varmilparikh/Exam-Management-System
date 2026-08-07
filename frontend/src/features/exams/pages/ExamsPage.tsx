import { useState } from "react";

import PageHeader from "@/components/common/PageHeader";

import ExamTable from "../components/ExamTable";
import CreateExamDialog from "../dialogs/CreateExamDialog";
import type { ExamFilters } from "../types/examFilters";
import ExamToolbar from "../components/ExamToolbar";
import PermissionGate from "@/permissions/PermissionGate";

export default function ExamsPage() {
  const [filters, setFilters] = useState<ExamFilters>({
    search: "",
    status: "",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        description="Manage examinations."
        actions={
          <PermissionGate permission="exam:create">
            <CreateExamDialog />
          </PermissionGate>
        }
      />

      <ExamToolbar filters={filters} onFiltersChange={setFilters} />

      <ExamTable filters={filters} />
    </div>
  );
}
