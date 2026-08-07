import { useState } from "react";

import PageHeader from "@/components/common/PageHeader";
import PermissionGate from "@/permissions/PermissionGate";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

import ExamDutyTable from "../components/ExamDutyTable";
import CreateExamDutyDialog from "../dialogs/CreateExamDutyDialog";
import ExamDutyToolbar from "../components/ExamDutyToolbar";

import type { ExamDutyFilters } from "../types/examDutyFilters";

import MyExamDutyTable from "../components/MyExamDutyTable";

export default function ExamDutiesPage() {
  const { data: user } = useCurrentUser();

  const canManage = user?.role === "SUPER_ADMIN" || user?.role === "COE";

  const [filters, setFilters] = useState<ExamDutyFilters>({
    search: "",
    status: "",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Duties"
        description={
          canManage
            ? "Assign examination duties."
            : "View your upcoming examination duties."
        }
        actions={
          canManage ? (
            <PermissionGate permission="duty:assign">
              <CreateExamDutyDialog />
            </PermissionGate>
          ) : undefined
        }
      />

      {canManage ? (
        <>
          <ExamDutyToolbar filters={filters} onFiltersChange={setFilters} />

          <ExamDutyTable filters={filters} canManage />
        </>
      ) : (
        <MyExamDutyTable />
      )}
    </div>
  );
}
