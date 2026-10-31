import { useQuery } from "@tanstack/react-query";

import { transferRequestService } from "../api/transferRequest.service";
import { transferRequestKeys } from "../queryKeys";

import type { TransferRequestFilters } from "../types/transferRequestFilters";
import type { Employee } from "@/features/employees/types/employee";

const DEFAULT_FILTERS: TransferRequestFilters = {
  search: "",
  status: "",
};

export function useTransferRequests(
  role: Employee["role"] | undefined,
  userId: string | undefined,
  filters: TransferRequestFilters = DEFAULT_FILTERS,
) {
  return useQuery({
    queryKey: transferRequestKeys.list(filters, userId),

    queryFn: () =>
      role === "FACULTY"
        ? transferRequestService.getMine(filters)
        : transferRequestService.getAll(filters),

    enabled: true,
  });
}
