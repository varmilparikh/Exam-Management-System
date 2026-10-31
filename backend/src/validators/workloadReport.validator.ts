import { z } from "zod";

import { commonReportQuerySchema } from "./commonReport.validator.js";

export const workloadReportQuerySchema = commonReportQuerySchema
  .extend({
    departmentId: z.uuid().optional(),

    facultyId: z.uuid().optional(),
  })
  .refine(
    ({ fromDate, toDate }) => !fromDate || !toDate || fromDate <= toDate,
    {
      path: ["toDate"],
      message: "To date must be on or after the from date",
    },
  );

export type WorkloadReportQuery = z.infer<typeof workloadReportQuerySchema>;
