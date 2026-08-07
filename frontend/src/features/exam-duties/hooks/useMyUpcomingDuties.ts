import { useQuery } from "@tanstack/react-query";

import { examDutyService } from "../api/examDuty.service";
import { examDutyKeys } from "../queryKeys";

export function useMyUpcomingDuties() {
  return useQuery({
    queryKey: examDutyKeys.upcoming(),
    queryFn: examDutyService.getMyUpcomingDuties,
  });
}
