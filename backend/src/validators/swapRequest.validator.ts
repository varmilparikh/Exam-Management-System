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
}).strict();

/**
 * Accept Swap Request
 */

export const approveSwapRequestSchema = z.object({
  approvalRemark: z.string().trim().min(3).max(500),
}).strict();

/**
 * Reject Swap Request Schema
 */
export const rejectSwapRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Reason must be at least 3 characters.")
    .max(500, "Reason cannot exceed 500 characters.")
    .optional(),
}).strict();

/**
 * Cancel Swap Request Schema
 */
export const cancelSwapRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Reason must be at least 3 characters.")
    .max(500, "Reason cannot exceed 500 characters.")
    .optional(),
}).strict();

/**
 * Reject Swap Request by COE Schema
 */
export const rejectSwapByCoeSchema = z.object({
  approvalRemark: z
    .string()
    .trim()
    .min(3, "Approval remark must be at least 3 characters.")
    .max(500, "Approval remark cannot exceed 500 characters."),
}).strict();