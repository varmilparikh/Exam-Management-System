import { z } from "zod";

import { DutyStatus } from "../generated/prisma/client.js";

/**
 * Create Exam Duty Validation
 */
export const createExamDutySchema = z.object({
  employeeId: z.uuid("Invalid employee ID"),

  examId: z.uuid("Invalid exam ID"),
});

/**
 * Update Exam Duty Validation
 */
export const updateExamDutySchema = z.object({
  employeeId: z
    .uuid("Invalid employee ID")
    .optional(),

  examId: z
    .uuid("Invalid exam ID")
    .optional(),

  status: z
    .nativeEnum(DutyStatus)
    .optional(),
});