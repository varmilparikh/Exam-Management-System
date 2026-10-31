import { z } from "zod";
import { ActivityAction } from "../generated/prisma/client.js";
import { commonReportQuerySchema } from "./commonReport.validator.js";

export const activityReportQuerySchema = commonReportQuerySchema.extend({
  action: z.nativeEnum(ActivityAction).optional(),
}).refine(({ fromDate, toDate }) => !fromDate || !toDate || fromDate <= toDate, {
  path: ["toDate"],
  message: "To date must be on or after the from date",
});

export type ActivityReportQuery = z.infer<typeof activityReportQuerySchema>;
