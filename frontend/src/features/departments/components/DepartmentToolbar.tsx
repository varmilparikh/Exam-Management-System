import Toolbar, {
  ToolbarLeft,
  ToolbarSearch,
} from "@/components/common/Toolbar";

import type { DepartmentFilters } from "../types/departmentFilters";

interface DepartmentToolbarProps {
  filters: DepartmentFilters;
  onFiltersChange: (filters: DepartmentFilters) => void;
}

export default function DepartmentToolbar({
  filters,
  onFiltersChange,
}: DepartmentToolbarProps) {
  return (
    <Toolbar>
      <ToolbarLeft>
        <ToolbarSearch
          value={filters.search}
          placeholder="Search departments..."
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              search: value,
            })
          }
        />
      </ToolbarLeft>
    </Toolbar>
  );
}
