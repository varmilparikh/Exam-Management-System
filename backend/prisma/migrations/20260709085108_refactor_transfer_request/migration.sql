/*
  Warnings:

  - The `entityType` column on the `activity_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `transfer_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('EMPLOYEE', 'DEPARTMENT', 'EXAM', 'EXAM_DUTY', 'TRANSFER_REQUEST', 'SWAP_REQUEST');

-- AlterEnum
ALTER TYPE "ActivityAction" ADD VALUE 'CANCEL_TRANSFER_REQUEST';

-- AlterEnum
ALTER TYPE "TransferStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "transfer_logs" DROP CONSTRAINT "transfer_logs_examDutyId_fkey";

-- DropForeignKey
ALTER TABLE "transfer_logs" DROP CONSTRAINT "transfer_logs_fromEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "transfer_logs" DROP CONSTRAINT "transfer_logs_toEmployeeId_fkey";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "entityType",
ADD COLUMN     "entityType" "EntityType";

-- DropTable
DROP TABLE "transfer_logs";

-- CreateTable
CREATE TABLE "transfer_requests" (
    "id" TEXT NOT NULL,
    "fromEmployeeId" TEXT NOT NULL,
    "toEmployeeId" TEXT,
    "examDutyId" TEXT NOT NULL,
    "status" "TransferStatus" NOT NULL,
    "reason" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvalRemark" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfer_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transfer_requests_fromEmployeeId_idx" ON "transfer_requests"("fromEmployeeId");

-- CreateIndex
CREATE INDEX "transfer_requests_toEmployeeId_idx" ON "transfer_requests"("toEmployeeId");

-- CreateIndex
CREATE INDEX "transfer_requests_examDutyId_idx" ON "transfer_requests"("examDutyId");

-- CreateIndex
CREATE INDEX "transfer_requests_status_idx" ON "transfer_requests"("status");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_entityType_idx" ON "activity_logs"("entityType");

-- AddForeignKey
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_fromEmployeeId_fkey" FOREIGN KEY ("fromEmployeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_toEmployeeId_fkey" FOREIGN KEY ("toEmployeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_examDutyId_fkey" FOREIGN KEY ("examDutyId") REFERENCES "exam_duties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
