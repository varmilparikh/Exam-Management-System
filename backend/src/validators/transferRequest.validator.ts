import { z } from "zod";

import { TransferStatus } from "../generated/prisma/client.js";

/**
 * Create Transfer Request Validation
 */
export const createTransferRequestSchema = z.object({
  toEmployeeId: z
    .uuid("Invalid replacement employee ID")
    .optional(),

  examDutyId: z.uuid("Invalid exam duty ID"),

  reason: z
    .string()
    .trim()
    .min(5)
    .max(500),
}).strict();

/**
 * Approve Transfer Request Validation
 */
export const approveTransferRequestSchema = z.object({


  toEmployeeId: z
    .uuid("Invalid replacement employee ID")
    .optional(),

  approvalRemark: z
    .string()
    .trim()
    .max(500, "Approval remark cannot exceed 500 characters")
    .optional(),
}).strict();

/**
 * Reject Transfer Request Validation
 */
export const rejectTransferRequestSchema = z.object({
  approvalRemark: z
    .string()
    .trim()
    .min(5, "Approval remark must be at least 5 characters")
    .max(500, "Approval remark cannot exceed 500 characters"),
}).strict();

/**
 * Cancel Transfer Request Validation
 */
export const cancelTransferRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(500, "Reason cannot exceed 500 characters")
    .optional(),
}).strict();

/**
 * Update Transfer Request Validation
 */
export const updateTransferRequestSchema = z.object({
  status: z
    .nativeEnum(TransferStatus)
    .optional(),

  approvalRemark: z
    .string()
    .trim()
    .max(500, "Approval remark cannot exceed 500 characters")
    .optional(),
}).strict();