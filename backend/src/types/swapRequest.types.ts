import type { SwapStatus } from "../generated/prisma/client.js";

/**
 * Create Swap Request DTO
 */
export interface CreateSwapRequestDto {
  receiverId: string;
  requesterDutyId: string;
  receiverDutyId: string;
  reason?: string;
}

/**
 * Approve Swap Request DTO
 */
export interface ApproveSwapRequestDto {
  approvedById: string;
}

/**
 * Reject Swap Request DTO
 */
export interface RejectSwapRequestDto {
  approvedById: string;
  reason: string;
}

/**
 * Update Swap Request DTO
 */
export interface UpdateSwapRequestDto {
  status?: SwapStatus;
}