import type {
  TransferStatus,
} from "../generated/prisma/client.js";

/**
 * Create Transfer Request DTO
 */
export interface CreateTransferRequestDto {
  toEmployeeId?: string;
  examDutyId: string;
  reason?: string;
}

/**
 * Approve Transfer Request DTO
 */
export interface ApproveTransferRequestDto {
  approvedById: string;

  /**
   * Optional.
   * COE can choose or change the replacement.
   */
  toEmployeeId?: string;

  approvalRemark?: string;
}

/**
 * Reject Transfer Request DTO
 */
export interface RejectTransferRequestDto {
  approvedById: string;

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