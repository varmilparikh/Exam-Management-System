import Toolbar, {
  ToolbarLeft,
  ToolbarSearch,
  ToolbarFilter,
} from "@/components/common/Toolbar";

import type { TransferRequestFilters } from "../types/transferRequestFilters";

const STATUS_OPTIONS = [
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Approved",
    value: "APPROVED",
  },
  {
    label: "Rejected",
    value: "REJECTED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];

interface TransferRequestToolbarProps {
  filters: TransferRequestFilters;
  onFiltersChange: (filters: TransferRequestFilters) => void;
}

export default function TransferRequestToolbar({
  filters,
  onFiltersChange,
}: TransferRequestToolbarProps) {
  return (
    <Toolbar>
      <ToolbarLeft>
        <ToolbarSearch
          value={filters.search}
          placeholder="Search transfer requests..."
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
          options={STATUS_OPTIONS}
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
