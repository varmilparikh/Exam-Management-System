import { useQuery } from "@tanstack/react-query";

import { examDutyService } from "../api/examDuty.service";
import { examDutyKeys } from "../queryKeys";

export function useFacultyUpcomingDuties(employeeId?: string) {
  return useQuery({
    queryKey: examDutyKeys.facultyUpcoming(employeeId ?? ""),

    queryFn: () => examDutyService.getFacultyUpcomingDuties(employeeId!),

    enabled: !!employeeId,
  });
}
