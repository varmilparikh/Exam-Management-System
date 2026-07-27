import { z } from "zod";

/**
 * Create Exam Validation
 */
export const createExamSchema = z
  .object({
    examName: z
      .string()
      .trim()
      .min(2, "Exam name must be at least 2 characters")
      .max(100, "Exam name cannot exceed 100 characters"),

    examDate: z.coerce
      .date()
      .refine((date) => !Number.isNaN(date.getTime()), "Invalid exam date"),

    requiredFaculty: z
      .number()
      .int()
      .positive("Required faculty must be greater than zero"),
  })
  .strict();

/**
 * Update Exam Validation
 */
export const updateExamSchema = z
  .object({
    examName: z
      .string()
      .trim()
      .min(2, "Exam name must be at least 2 characters")
      .max(100, "Exam name cannot exceed 100 characters")
      .optional(),

    examDate: z.coerce.date().optional(),

    requiredFaculty: z
      .number()
      .int()
      .positive("Required faculty must be greater than zero")
      .optional(),
  })
  .strict();
