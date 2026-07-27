/*
  Warnings:

  - Changed the type of `action` on the `activity_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE_DEPARTMENT', 'UPDATE_DEPARTMENT', 'DELETE_DEPARTMENT', 'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_EMPLOYEE', 'CREATE_EXAM', 'UPDATE_EXAM', 'DELETE_EXAM', 'ASSIGN_EXAM_DUTY', 'UPDATE_EXAM_DUTY', 'DELETE_EXAM_DUTY', 'CREATE_TRANSFER_REQUEST', 'APPROVE_TRANSFER_REQUEST', 'REJECT_TRANSFER_REQUEST', 'CREATE_SWAP_REQUEST', 'APPROVE_SWAP_REQUEST', 'REJECT_SWAP_REQUEST');

-- AlterTable
ALTER TABLE "activity_logs" ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT,
DROP COLUMN "action",
ADD COLUMN     "action" "ActivityAction" NOT NULL;
