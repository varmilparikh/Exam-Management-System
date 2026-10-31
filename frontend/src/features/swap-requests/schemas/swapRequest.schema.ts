import { z } from "zod";

export const createSwapRequestSchema = z.object({
  receiverId: z.string().uuid(),

  requesterDutyId: z.string().uuid(),

  receiverDutyId: z.string().uuid(),

  reason: z.string().max(500).optional(),
});

export type CreateSwapRequestFormValues = z.infer<
  typeof createSwapRequestSchema
>;

/**
 * Reject Swap
 */
export const rejectSwapRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Reason must be at least 3 characters.")
    .max(500, "Reason cannot exceed 500 characters.")
    .optional(),
});

export type RejectSwapRequestFormValues = z.infer<
  typeof rejectSwapRequestSchema
>;

/**
 * Cancel Swap
 */
export const cancelSwapRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Reason must be at least 3 characters.")
    .max(500, "Reason cannot exceed 500 characters.")
    .optional(),
});

export type CancelSwapRequestFormValues = z.infer<
  typeof cancelSwapRequestSchema
>;
