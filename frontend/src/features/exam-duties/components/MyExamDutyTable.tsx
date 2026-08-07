import DataTable from "@/components/common/DataTable";

import { useMyUpcomingDuties } from "../hooks/useMyUpcomingDuties";
import { getMyExamDutyColumns } from "../myColumns";

export default function MyExamDutyTable() {
  const { data = [], isLoading } = useMyUpcomingDuties();

  return (
    <DataTable
      columns={getMyExamDutyColumns()}
      data={data}
      loading={isLoading}
      emptyMessage="No upcoming examination duties."
    />
  );
}
