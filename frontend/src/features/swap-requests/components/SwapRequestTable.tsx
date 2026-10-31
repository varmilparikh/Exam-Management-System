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
  const { data = [], isLoading } = useSwapRequests(filters, currentUserId);

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
      emptyMessage="No swap requests found."
    />
  );
}
