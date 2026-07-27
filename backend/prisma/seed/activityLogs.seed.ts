import prisma from "../prisma.js";
import {
  ActivityAction,
  EntityType,
  TransferStatus,
  SwapStatus,
} from "../../src/generated/prisma/enums.js";

export async function seedActivityLogs() {
  console.log("📝 Seeding Activity Logs...");

  // ===========================
  // Transfer Requests
  // ===========================
  const transferRequests = await prisma.transferRequest.findMany({
    include: {
      examDuty: {
        include: {
          exam: true,
        },
      },
    },
  });

  for (const transfer of transferRequests) {
    let action: ActivityAction;

    switch (transfer.status) {
      case TransferStatus.PENDING:
        action = ActivityAction.CREATE_TRANSFER_REQUEST;
        break;

      case TransferStatus.APPROVED:
        action = ActivityAction.APPROVE_TRANSFER_REQUEST;
        break;

      case TransferStatus.REJECTED:
        action = ActivityAction.REJECT_TRANSFER_REQUEST;
        break;

      case TransferStatus.CANCELLED:
        action = ActivityAction.CANCEL_TRANSFER_REQUEST;
        break;
    }

    const description = `Transfer request (${transfer.status.toLowerCase()}) for "${transfer.examDuty.exam.examName}".`;

    const existing = await prisma.activityLog.findFirst({
      where: {
        employeeId: transfer.fromEmployeeId,
        action,
        entityId: transfer.id,
      },
    });

    if (!existing) {
      await prisma.activityLog.create({
        data: {
          employeeId: transfer.fromEmployeeId,
          action,
          description,
          entityType: EntityType.TRANSFER_REQUEST,
          entityId: transfer.id,
        },
      });
    }
  }

  // ===========================
  // Swap Requests
  // ===========================
  const swapRequests = await prisma.swapRequest.findMany({
    include: {
      requesterDuty: {
        include: {
          exam: true,
        },
      },
    },
  });

  for (const swap of swapRequests) {
    let action: ActivityAction;

    switch (swap.status) {
      case SwapStatus.PENDING:
        action = ActivityAction.CREATE_SWAP_REQUEST;
        break;

      case SwapStatus.APPROVED:
        action = ActivityAction.APPROVE_SWAP_REQUEST;
        break;

      case SwapStatus.REJECTED:
        action = swap.approvedById
          ? ActivityAction.REJECT_SWAP_REQUEST_BY_COE
          : ActivityAction.REJECT_SWAP_REQUEST_BY_RECEIVER;
        break;

      case SwapStatus.CANCELLED:
        action = ActivityAction.CANCEL_SWAP_REQUEST;
        break;

      case SwapStatus.ACCEPTED:
        action = ActivityAction.ACCEPT_SWAP_REQUEST;
        break;
    }

    const description = `Swap request (${swap.status.toLowerCase()}) for "${swap.requesterDuty.exam.examName}".`;

    const existing = await prisma.activityLog.findFirst({
      where: {
        employeeId: swap.requesterId,
        action,
        entityId: swap.id,
      },
    });

    if (!existing) {
      await prisma.activityLog.create({
        data: {
          employeeId: swap.requesterId,
          action,
          description,
          entityType: EntityType.SWAP_REQUEST,
          entityId: swap.id,
        },
      });
    }
  }

  console.log("✅ Activity logs seeded.");
}
