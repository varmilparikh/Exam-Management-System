import { z } from "zod";

import { TransferStatus } from "../generated/prisma/client.js";
import { commonReportQuerySchema } from "./commonReport.validator.js";

export const transferReportQuerySchema = commonReportQuerySchema
  .extend({
    status: z.nativeEnum(TransferStatus).optional(),
  })
  .refine(
    ({ fromDate, toDate }) => !fromDate || !toDate || fromDate <= toDate,
    {
      path: ["toDate"],
      message: "To date must be on or after the from date",
    },
  );

export type TransferReportQuery = z.infer<typeof transferReportQuerySchema>;
