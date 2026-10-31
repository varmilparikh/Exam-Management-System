import { z } from "zod";

import { ActivityAction } from "../generated/prisma/client.js";

export const activityLogQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    action: z.nativeEnum(ActivityAction).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    ({ fromDate, toDate }) => !fromDate || !toDate || fromDate <= toDate,
    {
      path: ["toDate"],
      message: "To date must be on or after the from date",
    },
  );

export type ActivityLogQuery = z.infer<typeof activityLogQuerySchema>;
