import { useQuery } from "@tanstack/react-query";

import { examService } from "../api/exam.service";
import { examKeys } from "../queryKeys";
import type { ExamFilters } from "../types/examFilters";

const DEFAULT_FILTERS: ExamFilters = {
  search: "",
  status: "",
};

export function useExams(filters: ExamFilters = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: [...examKeys.all, filters],
    queryFn: () => examService.getAll(filters),
  });
}
