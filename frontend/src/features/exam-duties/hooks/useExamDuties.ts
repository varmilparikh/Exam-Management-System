import { useQuery } from "@tanstack/react-query";

import { examDutyService } from "../api/examDuty.service";
import { examDutyKeys } from "../queryKeys";

import type { ExamDutyFilters } from "../types/examDutyFilters";

const DEFAULT_FILTERS: ExamDutyFilters = {
  search: "",
  status: "",
};

export function useExamDuties(filters: ExamDutyFilters = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: [...examDutyKeys.all, filters],
    queryFn: () => examDutyService.getAll(filters),
  });
}
