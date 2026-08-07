import { useMemo } from "react";

import DataTable from "@/components/common/DataTable";

import { useSwapRequests } from "../hooks/useSwapRequests";
import { getSwapRequestColumns } from "../columns";
import type { SwapRequestFilters } from "../types/swapRequestFilters";

interface SwapRequestTableProps {
  filters: SwapRequestFilters;
  canApprove: boolean;
  currentUserId: string;
}

export default function SwapRequestTable({
  filters,
  canApprove,
  currentUserId,
}: SwapRequestTableProps) {
  const { data = [], isLoading } = useSwapRequests(filters);

  const columns = useMemo(
    () =>
      getSwapRequestColumns({
        canApprove,
        currentUserId,
      }),
    [canApprove, currentUserId],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={isLoading}
      emptyMessage="No swap requests found."
    />
  );
}
