import type { ExamDutyFilters } from "./types/examDutyFilters";

export const examDutyKeys = {
  all: ["exam-duties"] as const,

  list: (filters: ExamDutyFilters) => [...examDutyKeys.all, filters] as const,

  mine: () => [...examDutyKeys.all, "me"] as const,

  upcoming: () => [...examDutyKeys.mine(), "upcoming"] as const,

  facultyUpcoming: (employeeId: string) =>
    [...examDutyKeys.all, "faculty", employeeId, "upcoming"] as const,

  detail: (id: string) => [...examDutyKeys.all, id] as const,
};
