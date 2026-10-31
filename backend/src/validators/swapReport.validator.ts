import { z } from "zod";

import { SwapStatus } from "../generated/prisma/client.js";
import { commonReportQuerySchema } from "./commonReport.validator.js";

export const swapReportQuerySchema = commonReportQuerySchema
  .extend({
    status: z.nativeEnum(SwapStatus).optional(),
  })
  .refine(
    ({ fromDate, toDate }) => !fromDate || !toDate || fromDate <= toDate,
    {
      path: ["toDate"],
      message: "To date must be on or after the from date",
    },
  );

export type SwapReportQuery = z.infer<typeof swapReportQuerySchema>;
