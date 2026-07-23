import { z } from "zod";

export const commonReportQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    sortBy: z.string().trim().optional(),

    sortOrder: z.enum(["asc", "desc"]).default("asc"),

    fromDate: z.coerce.date().optional(),

    toDate: z.coerce.date().optional(),
  })
  .strict();

export type CommonReportQuery = z.infer<typeof commonReportQuerySchema>;