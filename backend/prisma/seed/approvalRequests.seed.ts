import prisma from "../prisma.js";
import {
  ApprovalStatus,
  RequestType,
  SwapStatus,
  TransferStatus,
} from "../../src/generated/prisma/enums.js";

export async function seedApprovalRequests() {
  console.log("📋 Seeding Approval Requests...");

  // ============================================
  // Transfer Requests
  // ============================================
  const transferRequests = await prisma.transferRequest.findMany();

  for (const transfer of transferRequests) {
    let status: ApprovalStatus;

    switch (transfer.status) {
      case TransferStatus.PENDING:
        status = ApprovalStatus.PENDING;
        break;

      case TransferStatus.APPROVED:
        status = ApprovalStatus.APPROVED;
        break;

      case TransferStatus.REJECTED:
      case TransferStatus.CANCELLED:
        status = ApprovalStatus.REJECTED;
        break;
    }

    const existing = await prisma.approvalRequest.findFirst({
      where: {
        requestType: RequestType.TRANSFER,
        requestId: transfer.id,
      },
    });

    if (!existing) {
      await prisma.approvalRequest.create({
        data: {
          employeeId: transfer.fromEmployeeId,
          approvedById: transfer.approvedById,
          approvedAt: transfer.approvedAt,
          requestType: RequestType.TRANSFER,
          requestId: transfer.id,
          status,
          reason: transfer.reason,
        },
      });
    }
  }

  // ============================================
  // Swap Requests
  // ============================================
  const swapRequests = await prisma.swapRequest.findMany();

  for (const swap of swapRequests) {
    let status: ApprovalStatus;

    switch (swap.status) {
      case SwapStatus.PENDING:
      case SwapStatus.ACCEPTED:
        status = ApprovalStatus.PENDING;
        break;

      case SwapStatus.APPROVED:
        status = ApprovalStatus.APPROVED;
        break;

      case SwapStatus.REJECTED:
      case SwapStatus.CANCELLED:
        status = ApprovalStatus.REJECTED;
        break;
    }

    const existing = await prisma.approvalRequest.findFirst({
      where: {
        requestType: RequestType.SWAP,
        requestId: swap.id,
      },
    });

    if (!existing) {
      await prisma.approvalRequest.create({
        data: {
          employeeId: swap.requesterId,
          approvedById: swap.approvedById,
          approvedAt: swap.approvedAt,
          requestType: RequestType.SWAP,
          requestId: swap.id,
          status,
          reason: swap.reason,
        },
      });
    }
  }

  console.log("✅ Approval Requests seeded.");
}