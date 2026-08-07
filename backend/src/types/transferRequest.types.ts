import type { TransferStatus } from "../generated/prisma/client.js";

/**
 * Create Transfer Request DTO
 */
export interface CreateTransferRequestDto {
  toEmployeeId?: string;
  examDutyId: string;
  reason: string;
}

/**
 * Approve Transfer Request DTO
 */

export interface ApproveTransferRequestDto {
  toEmployeeId?: string;
  approvalRemark?: string;
}

export interface ApproveTransferTransactionData {
  id: string;

  approvedById: string;

  replacementEmployeeId: string;

  examDutyId: string;

  approvalRemark: string | null;
}

export interface RejectTransferTransactionData {
  id: string;

  approvedById: string;

  approvalRemark: string | null;
}

/**
 * Reject Transfer Request DTO
 */
export interface RejectTransferRequestDto {
  approvalRemark: string;
}

/**
 * Cancel Transfer Request DTO
 */
export interface CancelTransferRequestDto {
  reason?: string;
}

/**
 * Update Transfer Request DTO
 *
 * Reserved for future administrative updates.
 */
export interface UpdateTransferRequestDto {
  status?: TransferStatus;

  approvalRemark?: string;
}
