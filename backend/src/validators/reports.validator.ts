import { z } from "zod";

import { Role } from "../generated/prisma/client.js";

import { commonReportQuerySchema } from "./commonReport.validator.js";

export const employeeReportQuerySchema =
  commonReportQuerySchema.extend({

    departmentId: z.uuid().optional(),

    role: z.nativeEnum(Role).optional(),

    isActive: z
      .preprocess(
        (value) =>
          value === "true" ? true : value === "false" ? false : value,
        z.boolean(),
      )
      .optional(),

  });

export type EmployeeReportQuery =
  z.infer<typeof employeeReportQuerySchema>;
