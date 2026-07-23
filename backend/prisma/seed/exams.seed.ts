import prisma from "../prisma.js";
import { exams } from "./data/exams.data.js";

export async function seedExams() {
  console.log("📝 Seeding Exams...");

  for (const exam of exams) {
    await prisma.exam.upsert({
      where: {
        examName: exam.examName,
      },
      update: {
        examDate: exam.examDate,
        requiredFaculty: exam.requiredFaculty,
        status: exam.status,
      },
      create: exam,
    });
  }

  console.log(`✅ ${exams.length} exams seeded.`);
}