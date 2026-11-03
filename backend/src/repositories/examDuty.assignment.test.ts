import assert from "node:assert/strict";
import { test } from "node:test";
import { ExamOptInStatus, ExamStatus } from "../generated/prisma/client.js";
import { ApiError } from "../utils/apiError.js";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
process.env.ACCESS_TOKEN_SECRET ??= "test-access-secret-at-least-32-characters";
process.env.REFRESH_TOKEN_SECRET ??=
  "test-refresh-secret-at-least-32-characters";

const [{ ExamDutyRepository }, { ExamOptInRepository }] = await Promise.all([
  import("./examDuty.repository.js"),
  import("./examOptIn.repository.js"),
]);

const employeeId = "employee-1";
const examId = "exam-1";
const examDate = new Date("2099-05-10T00:00:00.000Z");
const startTime = new Date("2099-05-10T09:00:00.000Z");
const endTime = new Date("2099-05-10T12:00:00.000Z");

test("manual assignment rejects an employee's active opt-in for that exam", async () => {
  let createCalls = 0;
  let activeOptInWhere: unknown;
  const transaction = {
    exam: {
      findFirst: async () => ({
        id: examId,
        examDate,
        startTime,
        endTime,
        requiredFaculty: 2,
        status: ExamStatus.UPCOMING,
      }),
    },
    examDuty: {
      findFirst: async () => null,
      count: async () => 0,
      create: async () => {
        createCalls += 1;
        return {};
      },
    },
    examOptIn: {
      count: async () => 1,
      findFirst: async (args: { where: unknown }) => {
        activeOptInWhere = args.where;
        return { id: "opt-in-1" };
      },
    },
  };
  const database = {
    $transaction: async (
      callback: (tx: typeof transaction) => Promise<unknown>,
    ) => callback(transaction),
  } as unknown as ConstructorParameters<typeof ExamDutyRepository>[0];

  const repository = new ExamDutyRepository(database);

  await assert.rejects(
    repository.createAssignedWithCapacity(employeeId, examId),
    (error: unknown) =>
      error instanceof ApiError &&
      error.statusCode === 409 &&
      error.message ===
        "Employee already has an active opt-in for this exam. Review the opt-in instead.",
  );

  assert.deepEqual(activeOptInWhere, {
    employeeId,
    examId,
    status: {
      in: [ExamOptInStatus.PENDING, ExamOptInStatus.CONFIRMED],
    },
  });
  assert.equal(createCalls, 0);
});

test("opt-in confirmation reports an existing duty instead of creating a duplicate", async () => {
  let createCalls = 0;
  let updateCalls = 0;
  const transaction = {
    examOptIn: {
      findUnique: async () => ({
        id: "opt-in-1",
        employeeId,
        examId,
        status: ExamOptInStatus.PENDING,
        exam: {
          examDate,
          startTime,
          endTime,
          requiredFaculty: 2,
          status: ExamStatus.UPCOMING,
        },
      }),
      updateMany: async () => {
        updateCalls += 1;
        return { count: 1 };
      },
      findUniqueOrThrow: async () => ({}),
    },
    examDuty: {
      findFirst: async () => ({ id: "existing-duty-1" }),
      count: async () => 1,
      create: async () => {
        createCalls += 1;
        return {};
      },
    },
  };
  const database = {
    $transaction: async (
      callback: (tx: typeof transaction) => Promise<unknown>,
    ) => callback(transaction),
  } as unknown as ConstructorParameters<typeof ExamOptInRepository>[0];

  const repository = new ExamOptInRepository(database);

  await assert.rejects(
    repository.review("opt-in-1", "reviewer-1", "CONFIRM"),
    (error: unknown) =>
      error instanceof ApiError &&
      error.statusCode === 409 &&
      error.message ===
        "Faculty is already assigned to this exam. Reject the opt-in instead.",
  );

  assert.equal(createCalls, 0);
  assert.equal(updateCalls, 0);
});
