import assert from "node:assert/strict";
import test from "node:test";
import { createExamSchema } from "./exam.validator.js";
import { createTransferRequestSchema } from "./transferRequest.validator.js";

test("exam session validator rejects invalid time ranges", () => {
  const result = createExamSchema.safeParse({
    examName: "Mathematics Examination",
    examDate: "2026-12-12",
    sessionName: "Morning",
    startTime: "13:00",
    endTime: "10:00",
    requiredFaculty: 10,
  });
  assert.equal(result.success, false);
});

test("transfer request requires replacement details only for replacement-found requests", () => {
  const common = { examDutyId: "27a0a0a0-a0a0-40a0-80a0-a0a0a0a0a0a0", reason: "Medical reason" };
  assert.equal(createTransferRequestSchema.safeParse({ ...common, requestType: "NEEDS_ASSISTANCE" }).success, true);
  assert.equal(createTransferRequestSchema.safeParse({ ...common, requestType: "REPLACEMENT_FOUND" }).success, false);
  assert.equal(createTransferRequestSchema.safeParse({ ...common, requestType: "NEEDS_ASSISTANCE", toEmployeeId: "27a0a0a0-a0a0-40a0-80a0-a0a0a0a0a0a0" }).success, false);
});
