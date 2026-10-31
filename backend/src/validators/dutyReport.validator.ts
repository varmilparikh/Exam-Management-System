import { z } from "zod";
import { DutyStatus } from "../generated/prisma/client.js";
import { commonReportQuerySchema } from "./commonReport.validator.js";

export const dutyReportQuerySchema = commonReportQuerySchema.extend({
  status: z.nativeEnum(DutyStatus).optional(),
  departmentId: z.uuid().optional(),
  employeeId: z.uuid().optional(),
}).refine(({ fromDate, toDate }) => !fromDate || !toDate || fromDate <= toDate, {
  path: ["toDate"],
  message: "To date must be on or after the from date",
});

export type DutyReportQuery = z.infer<typeof dutyReportQuerySchema>;
