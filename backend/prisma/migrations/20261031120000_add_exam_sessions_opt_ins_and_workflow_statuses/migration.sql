ALTER TYPE "SwapStatus" ADD VALUE IF NOT EXISTS 'COMPLETED';

ALTER TYPE "ActivityAction" ADD VALUE IF NOT EXISTS 'CREATE_EXAM_OPT_IN';
ALTER TYPE "ActivityAction" ADD VALUE IF NOT EXISTS 'CANCEL_EXAM_OPT_IN';
ALTER TYPE "ActivityAction" ADD VALUE IF NOT EXISTS 'CONFIRM_EXAM_OPT_IN';
ALTER TYPE "ActivityAction" ADD VALUE IF NOT EXISTS 'REJECT_EXAM_OPT_IN';
ALTER TYPE "ActivityAction" ADD VALUE IF NOT EXISTS 'COMPLETE_SWAP_REQUEST';

CREATE TYPE "ExamOptInStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED');
CREATE TYPE "TransferRequestType" AS ENUM ('REPLACEMENT_FOUND', 'NEEDS_ASSISTANCE');

ALTER TABLE "exams"
ADD COLUMN "sessionName" TEXT,
ADD COLUMN "startTime" TIME(0),
ADD COLUMN "endTime" TIME(0);

UPDATE "exams"
SET "sessionName" = 'General',
    "startTime" = TIME '09:00',
    "endTime" = TIME '12:00';

ALTER TABLE "exams"
ALTER COLUMN "sessionName" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL,
ADD CONSTRAINT "exams_session_time_range_check" CHECK ("endTime" > "startTime");

CREATE INDEX "exams_session_date_time_idx" ON "exams"("examDate", "startTime", "endTime");

CREATE TABLE "exam_opt_ins" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "status" "ExamOptInStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewRemark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "exam_opt_ins_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "exam_opt_ins_employeeId_examId_key" ON "exam_opt_ins"("employeeId", "examId");
CREATE INDEX "exam_opt_ins_examId_status_idx" ON "exam_opt_ins"("examId", "status");
CREATE INDEX "exam_opt_ins_employeeId_status_idx" ON "exam_opt_ins"("employeeId", "status");
CREATE INDEX "exam_opt_ins_reviewedById_idx" ON "exam_opt_ins"("reviewedById");

ALTER TABLE "exam_opt_ins"
ADD CONSTRAINT "exam_opt_ins_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT "exam_opt_ins_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT "exam_opt_ins_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "transfer_requests"
ADD COLUMN "requestType" "TransferRequestType";

UPDATE "transfer_requests"
SET "requestType" = CASE
  WHEN "toEmployeeId" IS NULL THEN 'NEEDS_ASSISTANCE'::"TransferRequestType"
  ELSE 'REPLACEMENT_FOUND'::"TransferRequestType"
END;

ALTER TABLE "transfer_requests"
ALTER COLUMN "requestType" SET NOT NULL;

ALTER TABLE "swap_requests" ADD COLUMN "completedAt" TIMESTAMP(3);
UPDATE "swap_requests" SET "completedAt" = "approvedAt" WHERE "status" = 'APPROVED';
