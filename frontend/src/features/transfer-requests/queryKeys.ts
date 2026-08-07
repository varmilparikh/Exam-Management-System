import type { TransferRequestFilters } from "./types/transferRequestFilters";

export const transferRequestKeys = {
  all: ["transfer-requests"] as const,

  list: (filters: TransferRequestFilters) =>
    [...transferRequestKeys.all, filters] as const,

  mine: () => [...transferRequestKeys.all, "mine"] as const,

  detail: (id: string) => [...transferRequestKeys.all, id] as const,

  pending: () => [...transferRequestKeys.all, "pending"] as const,
};
