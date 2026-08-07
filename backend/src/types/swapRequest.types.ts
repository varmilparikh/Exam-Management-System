import type { SwapStatus } from "../generated/prisma/client.js";

/**
 * Create Swap Request DTO
 */
export interface CreateSwapRequestDto {
  receiverId: string;
  requesterDutyId: string;
  receiverDutyId: string;
  reason: string;
}

/**
 * Receiver accepts swap request
 */
export interface AcceptSwapRequestDto {
  receiverId: string;
}

/**
 * COE approves swap request
 */
export interface ApproveSwapRequestDto {
  approvalRemark: string;
}

/**
 * Receiver rejects swap request
 */
export interface RejectSwapRequestDto {
  reason: string;
}

/**
 * Cancel Swap Request DTO
 */
export interface CancelSwapRequestDto {
  reason: string;
}

/**
 * COE Reject Swap Request DTO
 */
export interface RejectSwapByCoeDto {
  approvalRemark: string;
}

/**
 * Update Swap Request DTO
 */
export interface UpdateSwapRequestDto {
  status?: SwapStatus;
}

export interface ApproveSwapTransactionData {
  id: string;
  approvedById: string;
  approvalRemark: string | null;
  requesterDutyId: string;
  receiverDutyId: string;
  requesterId: string;
  receiverId: string;
}
