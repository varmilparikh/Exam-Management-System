import { z } from "zod";

import { DutyStatus } from "../generated/prisma/client.js";

/**
 * Create Exam Duty Validation
 */
export const createExamDutySchema = z.object({
  employeeId: z.uuid("Invalid employee ID"),

  examId: z.uuid("Invalid exam ID"),
}).strict();

/**
 * Update Exam Duty Validation
 */
export const updateExamDutySchema = z.object({
  status: z
    .nativeEnum(DutyStatus)
    .optional(),
}).strict();