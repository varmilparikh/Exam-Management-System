/*
  Warnings:

  - The values [OPTED_IN] on the enum `DutyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DutyStatus_new" AS ENUM ('ASSIGNED', 'ATTENDED', 'TRANSFERRED', 'ABSENT');
ALTER TABLE "exam_duties" ALTER COLUMN "status" TYPE "DutyStatus_new" USING ("status"::text::"DutyStatus_new");
ALTER TYPE "DutyStatus" RENAME TO "DutyStatus_old";
ALTER TYPE "DutyStatus_new" RENAME TO "DutyStatus";
DROP TYPE "public"."DutyStatus_old";
COMMIT;
