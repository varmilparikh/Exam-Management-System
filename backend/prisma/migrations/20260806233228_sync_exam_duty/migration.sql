-- AlterEnum
ALTER TYPE "TransferStatus" ADD VALUE 'ACCEPTED';

-- DropForeignKey
ALTER TABLE "approval_requests" DROP CONSTRAINT "approval_requests_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "exam_duties" DROP CONSTRAINT "exam_duties_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "swap_requests" DROP CONSTRAINT "swap_requests_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "transfer_requests" DROP CONSTRAINT "transfer_requests_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "transfer_requests" DROP CONSTRAINT "transfer_requests_toEmployeeId_fkey";

-- AlterTable
ALTER TABLE "exam_duties" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "readAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "activity_logs_isDeleted_idx" ON "activity_logs"("isDeleted");

-- CreateIndex
CREATE INDEX "approval_requests_isDeleted_idx" ON "approval_requests"("isDeleted");

-- CreateIndex
CREATE INDEX "employees_isDeleted_isActive_idx" ON "employees"("isDeleted", "isActive");

-- CreateIndex
CREATE INDEX "exam_duties_isDeleted_idx" ON "exam_duties"("isDeleted");

-- CreateIndex
CREATE INDEX "exams_status_examDate_idx" ON "exams"("status", "examDate");

-- CreateIndex
CREATE INDEX "notifications_isDeleted_idx" ON "notifications"("isDeleted");

-- CreateIndex
CREATE INDEX "swap_requests_isDeleted_idx" ON "swap_requests"("isDeleted");

-- CreateIndex
CREATE INDEX "swap_requests_status_createdAt_idx" ON "swap_requests"("status", "createdAt");

-- CreateIndex
CREATE INDEX "transfer_requests_status_createdAt_idx" ON "transfer_requests"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "exam_duties" ADD CONSTRAINT "exam_duties_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_toEmployeeId_fkey" FOREIGN KEY ("toEmployeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swap_requests" ADD CONSTRAINT "swap_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
