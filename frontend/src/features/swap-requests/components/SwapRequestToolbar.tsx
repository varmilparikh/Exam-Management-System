import type { SwapRequestFilters } from "../types/swapRequestFilters";

import Toolbar, {
  ToolbarLeft,
  ToolbarSearch,
  ToolbarFilter,
} from "@/components/common/Toolbar";

interface SwapRequestToolbarProps {
  filters: SwapRequestFilters;

  onFiltersChange: (filters: SwapRequestFilters) => void;
}

export default function SwapRequestToolbar({
  filters,
  onFiltersChange,
}: SwapRequestToolbarProps) {
  return (
    <Toolbar>
      <ToolbarLeft>
        <ToolbarSearch
          value={filters.search}
          placeholder="Search swap requests..."
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              search: value,
            })
          }
        />

        <ToolbarFilter
          value={filters.status}
          placeholder="Status"
          options={[
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ]}
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value,
            })
          }
        />
      </ToolbarLeft>
    </Toolbar>
  );
}
