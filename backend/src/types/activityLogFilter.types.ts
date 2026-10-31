import type { ActivityAction } from "../generated/prisma/client.js";

export interface ActivityLogFilters {
  search?: string;
  action?: ActivityAction;
  fromDate?: Date;
  toDate?: Date;
}
