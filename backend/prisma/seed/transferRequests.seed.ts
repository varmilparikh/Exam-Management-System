import prisma from "../prisma.js";
import { transferRequests } from "./data/transferRequests.data.js";

export async function seedTransferRequests() {
  console.log("🔄 Seeding Transfer Requests...");

  for (const request of transferRequests) {
    const fromEmployee = await prisma.employee.findUnique({
      where: {
        employeeCode: request.fromEmployeeCode,
      },
    });

    if (!fromEmployee) {
      throw new Error(`Employee '${request.fromEmployeeCode}' not found.`);
    }

    const toEmployee = request.toEmployeeCode
      ? await prisma.employee.findUnique({
          where: {
            employeeCode: request.toEmployeeCode,
          },
        })
      : null;

    const approvedBy = request.approvedByCode
      ? await prisma.employee.findUnique({
          where: {
            employeeCode: request.approvedByCode,
          },
        })
      : null;

    const exam = await prisma.exam.findUnique({
      where: {
        examName: request.examName,
      },
    });

    if (!exam) {
      throw new Error(`Exam '${request.examName}' not found.`);
    }

    const duty = await prisma.examDuty.findFirst({
      where: {
        examId: exam.id,
        employeeId: fromEmployee.id,
      },
    });

    if (!duty) {
      throw new Error(
        `Duty not found for ${request.fromEmployeeCode} in ${request.examName}.`
      );
    }

    const existing = await prisma.transferRequest.findFirst({
      where: {
        examDutyId: duty.id,
        fromEmployeeId: fromEmployee.id,
      },
    });

    if (existing) {
      await prisma.transferRequest.update({
        where: {
          id: existing.id,
        },
        data: {
          toEmployeeId: toEmployee?.id ?? null,
          status: request.status,
          reason: request.reason,
          approvalRemark: request.approvalRemark,
          approvedById: approvedBy?.id ?? null,
          approvedAt:
            request.status === "APPROVED" ||
            request.status === "REJECTED"
              ? new Date()
              : null,
        },
      });
    } else {
      await prisma.transferRequest.create({
        data: {
          fromEmployeeId: fromEmployee.id,
          toEmployeeId: toEmployee?.id ?? null,
          examDutyId: duty.id,
          status: request.status,
          reason: request.reason,
          approvalRemark: request.approvalRemark,
          approvedById: approvedBy?.id ?? null,
          approvedAt:
            request.status === "APPROVED" ||
            request.status === "REJECTED"
              ? new Date()
              : null,
        },
      });
    }
  }

  console.log(`✅ ${transferRequests.length} transfer requests seeded.`);
}