import DataTable from "@/components/common/DataTable";

import { useMyUpcomingDuties } from "../hooks/useMyUpcomingDuties";
import { getMyExamDutyColumns } from "../myColumns";

export default function MyExamDutyTable() {
  const { data = [], isLoading, isError, refetch } = useMyUpcomingDuties();

  return (
    <DataTable
      columns={getMyExamDutyColumns()}
      data={data}
      loading={isLoading}
      error={isError}
      onRetry={() => void refetch()}
      errorMessage="Your upcoming duties could not be retrieved. Check your connection and try again."
      emptyMessage="No upcoming examination duties."
    />
  );
}
