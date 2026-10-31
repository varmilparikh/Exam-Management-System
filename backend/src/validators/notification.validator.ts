import { z } from "zod";

export const notificationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

/**
 * Create Notification Validation
 */
export const createNotificationSchema = z.object({
  employeeId: z.uuid("Invalid employee ID"),

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(500, "Message cannot exceed 500 characters"),
}).strict();

/**
 * Update Notification Validation
 */
export const updateNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),

  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(500, "Message cannot exceed 500 characters")
    .optional(),

  isRead: z.boolean().optional(),
}).strict();
