import { z } from "zod";

import { TransferRequestType, TransferStatus } from "../generated/prisma/client.js";

/**
 * Create Transfer Request Validation
 */
export const createTransferRequestSchema = z.object({
  requestType: z.nativeEnum(TransferRequestType),
  toEmployeeId: z
    .uuid("Invalid replacement employee ID")
    .optional(),

  examDutyId: z.uuid("Invalid exam duty ID"),

  reason: z
    .string()
    .trim()
    .min(5)
    .max(500),
}).strict().refine(
  (data) => data.requestType !== TransferRequestType.REPLACEMENT_FOUND || Boolean(data.toEmployeeId),
  { path: ["toEmployeeId"], message: "Select the replacement faculty member you have found." },
).refine(
  (data) => data.requestType !== TransferRequestType.NEEDS_ASSISTANCE || !data.toEmployeeId,
  { path: ["toEmployeeId"], message: "Leave replacement blank when requesting assistance." },
);

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
