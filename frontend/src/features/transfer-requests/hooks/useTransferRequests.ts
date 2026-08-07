import { useQuery } from "@tanstack/react-query";

import { transferRequestService } from "../api/transferRequest.service";
import { transferRequestKeys } from "../queryKeys";

import type { TransferRequestFilters } from "../types/transferRequestFilters";

const DEFAULT_FILTERS: TransferRequestFilters = {
  search: "",
  status: "",
};

export function useTransferRequests(
  canApprove: boolean,
  filters: TransferRequestFilters = DEFAULT_FILTERS,
) {
  return useQuery({
    queryKey: transferRequestKeys.list(filters),

    queryFn: () =>
      canApprove
        ? transferRequestService.getAll(filters)
        : transferRequestService.getMine(),

    enabled: true,
  });
}
