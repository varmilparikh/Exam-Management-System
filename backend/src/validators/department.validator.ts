import { z } from "zod";

/**
 * Create Department Validation
 */
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name cannot exceed 100 characters"),
}).strict();

/**
 * Update Department Validation
 */
export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name cannot exceed 100 characters")
    .optional(),
}).strict();