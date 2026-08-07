import type { TransferStatus } from "../generated/prisma/client.js";

export interface TransferRequestFilters {
  search?: string;
  status?: TransferStatus;
}
