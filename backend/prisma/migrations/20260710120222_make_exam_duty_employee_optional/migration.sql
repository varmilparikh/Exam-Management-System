-- DropForeignKey
ALTER TABLE "exam_duties" DROP CONSTRAINT "exam_duties_employeeId_fkey";

-- AlterTable
ALTER TABLE "exam_duties" ALTER COLUMN "employeeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "exam_duties" ADD CONSTRAINT "exam_duties_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
