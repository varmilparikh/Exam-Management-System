import { z } from "zod";

/**
 * Create Swap Request
 */
export const createSwapRequestSchema = z.object({
  receiverId: z.uuid("Invalid receiver ID"),

  requesterDutyId: z.uuid("Invalid requester duty ID"),

  receiverDutyId: z.uuid("Invalid receiver duty ID"),

  reason: z
    .string()
    .trim()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason cannot exceed 500 characters")
    .optional(),
});

/**
 * Accept Swap Request
 */
export const acceptSwapRequestSchema = z.object({
  receiverId: z.uuid("Invalid receiver ID"),
});