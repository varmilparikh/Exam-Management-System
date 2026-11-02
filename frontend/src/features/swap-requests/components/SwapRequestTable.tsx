import { useMemo } from "react";

import DataTable from "@/components/common/DataTable";

import { useSwapRequests } from "../hooks/useSwapRequests";
import { getSwapRequestColumns } from "../columns";
import type { SwapRequestFilters } from "../types/swapRequestFilters";

interface SwapRequestTableProps {
  filters: SwapRequestFilters;
  currentUserId: string;
}

export default function SwapRequestTable({
  filters,
  currentUserId,
}: SwapRequestTableProps) {
  const { data = [], isLoading, isError, refetch } = useSwapRequests(filters, currentUserId);

  const columns = useMemo(
    () =>
      getSwapRequestColumns({
        currentUserId,
      }),
    [currentUserId],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={isLoading}
      error={isError}
      onRetry={() => void refetch()}
      errorMessage="Swap requests could not be retrieved. Check your connection and try again."
      emptyMessage="No swap requests found."
    />
  );
}
