import prisma from "../prisma.js";
import { swapRequests } from "./data/swapRequests.data.js";

export async function seedSwapRequests() {
  console.log("🔁 Seeding Swap Requests...");

  for (const request of swapRequests) {
    const requester = await prisma.employee.findUnique({
      where: {
        employeeCode: request.requesterCode,
      },
    });

    if (!requester) {
      throw new Error(`Requester '${request.requesterCode}' not found.`);
    }

    const receiver = await prisma.employee.findUnique({
      where: {
        employeeCode: request.receiverCode,
      },
    });

    if (!receiver) {
      throw new Error(`Receiver '${request.receiverCode}' not found.`);
    }

    const requesterExam = await prisma.exam.findUnique({
      where: {
        examName: request.requesterExam,
      },
    });

    if (!requesterExam) {
      throw new Error(`Exam '${request.requesterExam}' not found.`);
    }

    const receiverExam = await prisma.exam.findUnique({
      where: {
        examName: request.receiverExam,
      },
    });

    if (!receiverExam) {
      throw new Error(`Exam '${request.receiverExam}' not found.`);
    }

    const requesterDuty = await prisma.examDuty.findFirst({
      where: {
        examId: requesterExam.id,
        employeeId: requester.id,
      },
    });

    if (!requesterDuty) {
      throw new Error(
        `Requester duty not found (${request.requesterCode} - ${request.requesterExam}).`
      );
    }

    const receiverDuty = await prisma.examDuty.findFirst({
      where: {
        examId: receiverExam.id,
        employeeId: receiver.id,
      },
    });

    if (!receiverDuty) {
      throw new Error(
        `Receiver duty not found (${request.receiverCode} - ${request.receiverExam}).`
      );
    }

    const approver = request.approvedByCode
      ? await prisma.employee.findUnique({
          where: {
            employeeCode: request.approvedByCode,
          },
        })
      : null;

    const existing = await prisma.swapRequest.findFirst({
      where: {
        requesterDutyId: requesterDuty.id,
        receiverDutyId: receiverDuty.id,
      },
    });

    if (existing) {
      await prisma.swapRequest.update({
        where: {
          id: existing.id,
        },
        data: {
          status: request.status,
          reason: request.reason,
          approvedById: approver?.id ?? null,
          approvalRemark: request.approvalRemark,
          approvedAt:
            request.status === "APPROVED" ||
            request.status === "REJECTED"
              ? new Date()
              : null,
        },
      });
    } else {
      await prisma.swapRequest.create({
        data: {
          requesterId: requester.id,
          receiverId: receiver.id,
          requesterDutyId: requesterDuty.id,
          receiverDutyId: receiverDuty.id,
          status: request.status,
          reason: request.reason,
          approvedById: approver?.id ?? null,
          approvalRemark: request.approvalRemark,
          approvedAt:
            request.status === "APPROVED" ||
            request.status === "REJECTED"
              ? new Date()
              : null,
        },
      });
    }
  }

  console.log(`✅ ${swapRequests.length} swap requests seeded.`);
}