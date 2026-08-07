import Toolbar, {
  ToolbarLeft,
  ToolbarSearch,
} from "@/components/common/Toolbar";

import type { ExamDutyFilters } from "../types/examDutyFilters";

interface ExamToolbarProps {
  filters: ExamDutyFilters;
  onFiltersChange: (filters: ExamDutyFilters) => void;
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
