import dotenv from "dotenv";

dotenv.config();

import prisma from "./prisma.js";

import { seedDepartments } from "./seed/departments.seed.js";
import { seedEmployees } from "./seed/employees.seed.js";
import { seedExams } from "./seed/exams.seed.js";
import { seedExamDuties } from "./seed/examDuties.seed.js";
import { seedTransferRequests } from "./seed/transferRequests.seed.js";
import { seedSwapRequests } from "./seed/swapRequests.seed.js";
import { seedNotifications } from "./seed/notifications.seed.js";
import { seedActivityLogs } from "./seed/activityLogs.seed.js";
import { seedApprovalRequests } from "./seed/approvalRequests.seed.js";

async function main() {
  console.log("🌱 Starting database seed...");

  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "Loaded ✅" : "Missing ❌",
  );

  await seedDepartments();

  await seedEmployees();
  
  await seedExams();

  await seedExamDuties();

  await seedTransferRequests();

  await seedSwapRequests();

  await seedNotifications();

  await seedActivityLogs();

  await seedApprovalRequests();

  console.log("🎉 Database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });