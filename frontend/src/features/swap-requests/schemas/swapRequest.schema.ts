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
 * Approve Swap
 */
export const approveSwapRequestSchema = z.object({
  approvalRemark: z
    .string()
    .trim()
    .min(3, "Approval remark must be at least 3 characters.")
    .max(500, "Approval remark cannot exceed 500 characters."),
});

export type ApproveSwapRequestFormValues = z.infer<
  typeof approveSwapRequestSchema
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

/**
 * Reject By COE
 */
export const rejectSwapByCoeSchema = z.object({
  approvalRemark: z
    .string()
    .trim()
    .min(3, "Approval remark must be at least 3 characters.")
    .max(500, "Approval remark cannot exceed 500 characters."),
});

export type RejectSwapByCoeFormValues = z.infer<typeof rejectSwapByCoeSchema>;
