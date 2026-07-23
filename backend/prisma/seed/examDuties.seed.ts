import prisma from "../prisma.js";
import { DutyStatus } from "../../src/generated/prisma/enums.js";
import { examDuties } from "./data/examDuties.data.js";

export async function seedExamDuties() {
  console.log("🗓️ Seeding Exam Duties...");

  for (const duty of examDuties) {
    const exam = await prisma.exam.findUnique({
      where: {
        examName: duty.examName,
      },
    });

    if (!exam) {
      throw new Error(`Exam '${duty.examName}' not found.`);
    }

    let employeeId: string | null = null;

    if (duty.employeeCode) {
      const employee = await prisma.employee.findUnique({
        where: {
          employeeCode: duty.employeeCode,
        },
      });

      if (!employee) {
        throw new Error(`Employee '${duty.employeeCode}' not found.`);
      }

      employeeId = employee.id;
    }

    const existingDuty = await prisma.examDuty.findFirst({
      where: {
        employeeId,
        examId: exam.id,
      },
    });

    if (existingDuty) {
      await prisma.examDuty.update({
        where: {
          id: existingDuty.id,
        },
        data: {
          status: duty.status as DutyStatus,
        },
      });
    } else {
      await prisma.examDuty.create({
        data: {
          employeeId,
          examId: exam.id,
          status: duty.status as DutyStatus,
        },
      });
    }
  }

  console.log(`✅ ${examDuties.length} exam duties seeded.`);
}
