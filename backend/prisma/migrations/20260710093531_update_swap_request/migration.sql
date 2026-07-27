/*
  Warnings:

  - The values [REJECT_SWAP_REQUEST] on the enum `ActivityAction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isDeleted` on the `exam_duties` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityAction_new" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE_DEPARTMENT', 'UPDATE_DEPARTMENT', 'DELETE_DEPARTMENT', 'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_EMPLOYEE', 'CREATE_EXAM', 'UPDATE_EXAM', 'DELETE_EXAM', 'ASSIGN_EXAM_DUTY', 'UPDATE_EXAM_DUTY', 'DELETE_EXAM_DUTY', 'CREATE_TRANSFER_REQUEST', 'APPROVE_TRANSFER_REQUEST', 'REJECT_TRANSFER_REQUEST', 'CANCEL_TRANSFER_REQUEST', 'CREATE_SWAP_REQUEST', 'ACCEPT_SWAP_REQUEST', 'APPROVE_SWAP_REQUEST', 'CANCEL_SWAP_REQUEST', 'REJECT_SWAP_REQUEST_BY_RECEIVER', 'REJECT_SWAP_REQUEST_BY_COE');
ALTER TABLE "activity_logs" ALTER COLUMN "action" TYPE "ActivityAction_new" USING ("action"::text::"ActivityAction_new");
ALTER TYPE "ActivityAction" RENAME TO "ActivityAction_old";
ALTER TYPE "ActivityAction_new" RENAME TO "ActivityAction";
DROP TYPE "public"."ActivityAction_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SwapStatus" ADD VALUE 'ACCEPTED';
ALTER TYPE "SwapStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "exam_duties" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "swap_requests" ADD COLUMN     "approvalRemark" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT;

-- CreateIndex
CREATE INDEX "swap_requests_requesterDutyId_idx" ON "swap_requests"("requesterDutyId");

-- CreateIndex
CREATE INDEX "swap_requests_receiverDutyId_idx" ON "swap_requests"("receiverDutyId");

-- CreateIndex
CREATE INDEX "swap_requests_status_idx" ON "swap_requests"("status");

-- CreateIndex
CREATE INDEX "swap_requests_approvedById_idx" ON "swap_requests"("approvedById");

-- AddForeignKey
ALTER TABLE "swap_requests" ADD CONSTRAINT "swap_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
