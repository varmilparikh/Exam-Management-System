import Toolbar, {
  ToolbarLeft,
  ToolbarSearch,
} from "@/components/common/Toolbar";

import type { ExamFilters } from "../types/examFilters";

interface ExamToolbarProps {
  filters: ExamFilters;
  onFiltersChange: (filters: ExamFilters) => void;
}

export default function ExamToolbar({
  filters,
  onFiltersChange,
}: ExamToolbarProps) {
  return (
    <Toolbar>
      <ToolbarLeft>
        <ToolbarSearch
          value={filters.search}
          placeholder="Search exams..."
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
