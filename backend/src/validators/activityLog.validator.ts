import { z } from "zod";

import { ActivityAction } from "../generated/prisma/client.js";

/**
 * Create Activity Log Validation
 */
export const createActivityLogSchema = z.object({
  employeeId: z.uuid("Invalid employee ID"),

  action: z.nativeEnum(ActivityAction),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters"),

  entityType: z
    .string()
    .trim()
    .max(100)
    .optional(),

  entityId: z
    .string()
    .uuid("Invalid entity ID")
    .optional(),

  ipAddress: z
    .string()
    .max(45)
    .optional(),

  userAgent: z
    .string()
    .max(500)
    .optional(),
});

/**
 * Update Activity Log Validation
 */
export const updateActivityLogSchema = z.object({
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});