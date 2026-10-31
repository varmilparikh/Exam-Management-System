import { useQuery } from "@tanstack/react-query";

import { swapRequestService } from "../api/swapRequest.service";
import { swapRequestKeys } from "../queryKeys";

import type { SwapRequestFilters } from "../types/swapRequestFilters";

const DEFAULT_FILTERS: SwapRequestFilters = {
  search: "",
  status: "",
};

export function useSwapRequests(
  filters: SwapRequestFilters = DEFAULT_FILTERS,
  userId?: string,
) {
  return useQuery({
    queryKey: [...swapRequestKeys.all, userId, filters],
    queryFn: () => swapRequestService.getAll(filters),
  });
}
