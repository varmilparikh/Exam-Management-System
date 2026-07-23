import prisma from "../prisma.js";

export async function seedNotifications() {
  console.log("🔔 Seeding Notifications...");

  // -----------------------------
  // Transfer Request Notifications
  // -----------------------------
  const transferRequests = await prisma.transferRequest.findMany({
    include: {
      fromEmployee: true,
      toEmployee: true,
      examDuty: {
        include: {
          exam: true,
        },
      },
    },
  });

  for (const transfer of transferRequests) {
    // Notification for requester
    const requesterTitle = "Transfer Request Update";
    const requesterMessage = `Your transfer request for "${transfer.examDuty.exam.examName}" is ${transfer.status.toLowerCase()}.`;

    const existingRequesterNotification = await prisma.notification.findFirst({
      where: {
        employeeId: transfer.fromEmployeeId,
        title: requesterTitle,
        message: requesterMessage,
      },
    });

    if (!existingRequesterNotification) {
      await prisma.notification.create({
        data: {
          employeeId: transfer.fromEmployeeId,
          title: requesterTitle,
          message: requesterMessage,
        },
      });
    }

    // Notification for receiver
    if (transfer.toEmployeeId) {
      const receiverTitle = "Transfer Request";
      const receiverMessage = `${transfer.fromEmployee.name} requested to transfer the duty for "${transfer.examDuty.exam.examName}" to you.`;

      const existingReceiverNotification = await prisma.notification.findFirst({
        where: {
          employeeId: transfer.toEmployeeId,
          title: receiverTitle,
          message: receiverMessage,
        },
      });

      if (!existingReceiverNotification) {
        await prisma.notification.create({
          data: {
            employeeId: transfer.toEmployeeId!,
            title: receiverTitle,
            message: receiverMessage,
          },
        });
      }
    }
  }

  // -----------------------------
  // Swap Request Notifications
  // -----------------------------
  const swapRequests = await prisma.swapRequest.findMany({
    include: {
      requester: true,
      receiver: true,
      requesterDuty: {
        include: {
          exam: true,
        },
      },
    },
  });

  for (const swap of swapRequests) {
    const swapRequesterTitle = "Swap Request Update";
    const swapRequesterMessage = `Your swap request for "${swap.requesterDuty.exam.examName}" is ${swap.status.toLowerCase()}.`;

    const existingSwapRequester = await prisma.notification.findFirst({
      where: {
        employeeId: swap.requesterId,
        title: swapRequesterTitle,
        message: swapRequesterMessage,
      },
    });

    if (!existingSwapRequester) {
      await prisma.notification.create({
        data: {
          employeeId: swap.requesterId,
          title: swapRequesterTitle,
          message: swapRequesterMessage,
        },
      });
    }

    const swapReceiverTitle = "Swap Request";
    const swapReceiverMessage = `${swap.requester.name} wants to swap exam duties with you.`;

    const existingSwapReceiver = await prisma.notification.findFirst({
      where: {
        employeeId: swap.receiverId,
        title: swapReceiverTitle,
        message: swapReceiverMessage,
      },
    });

    if (!existingSwapReceiver) {
      await prisma.notification.create({
        data: {
          employeeId: swap.receiverId,
          title: swapReceiverTitle,
          message: swapReceiverMessage,
        },
      });
    }
  }

  console.log("✅ Notifications seeded.");
}
