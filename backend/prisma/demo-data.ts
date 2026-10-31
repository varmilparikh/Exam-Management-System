import bcrypt from "bcryptjs";
import "dotenv/config";

import prisma from "./prisma.js";
import {
  ActivityAction,
  ApprovalStatus,
  DutyStatus,
  EntityType,
  ExamOptInStatus,
  ExamStatus,
  LoginProvider,
  RequestType,
  Role,
  SwapStatus,
  TransferRequestType,
  TransferStatus,
} from "../src/generated/prisma/enums.js";

const demoPassword = process.env.DEMO_PASSWORD;
const rowCounts: Record<string, { created: number; alreadyPresent: number }> = {};

function recordRow(name: string, alreadyPresent: boolean) {
  const counts = rowCounts[name] ?? { created: 0, alreadyPresent: 0 };
  if (alreadyPresent) counts.alreadyPresent += 1;
  else counts.created += 1;
  rowCounts[name] = counts;
}

if (!demoPassword || demoPassword.length < 12) {
  throw new Error("Set DEMO_PASSWORD to a value with at least 12 characters.");
}

const demoComputerEngineering = "Demo Computer Engineering";
const demoInformationTechnology = "Demo Information Technology";
const demoDepartments = [demoComputerEngineering, demoInformationTechnology];

const employeeFixtures = [
  {
    employeeCode: "DEMO001",
    email: "demo.admin@demo.invalid",
    name: "Demo Administrator",
    designation: "System Administrator",
    role: Role.SUPER_ADMIN,
    department: demoComputerEngineering,
  },
  {
    employeeCode: "DEMO002",
    email: "demo.coe@demo.invalid",
    name: "Demo Controller",
    designation: "Controller of Examinations",
    role: Role.COE,
    department: demoComputerEngineering,
  },
  {
    employeeCode: "DEMO003",
    email: "demo.hod.ce@demo.invalid",
    name: "Demo HOD, Computer Engineering",
    designation: "Head of Department",
    role: Role.HOD,
    department: demoComputerEngineering,
  },
  {
    employeeCode: "DEMO004",
    email: "demo.hod.it@demo.invalid",
    name: "Demo HOD, Information Technology",
    designation: "Head of Department",
    role: Role.HOD,
    department: demoInformationTechnology,
  },
  {
    employeeCode: "DEMO005",
    email: "demo.faculty01@demo.invalid",
    name: "Aarav Mehta",
    designation: "Assistant Professor",
    role: Role.FACULTY,
    department: demoComputerEngineering,
  },
  {
    employeeCode: "DEMO006",
    email: "demo.faculty02@demo.invalid",
    name: "Isha Patel",
    designation: "Associate Professor",
    role: Role.FACULTY,
    department: demoComputerEngineering,
  },
  {
    employeeCode: "DEMO007",
    email: "demo.faculty03@demo.invalid",
    name: "Kabir Shah",
    designation: "Assistant Professor",
    role: Role.FACULTY,
    department: demoComputerEngineering,
  },
  {
    employeeCode: "DEMO008",
    email: "demo.faculty04@demo.invalid",
    name: "Diya Joshi",
    designation: "Assistant Professor",
    role: Role.FACULTY,
    department: demoInformationTechnology,
  },
  {
    employeeCode: "DEMO009",
    email: "demo.faculty05@demo.invalid",
    name: "Rehan Khan",
    designation: "Associate Professor",
    role: Role.FACULTY,
    department: demoInformationTechnology,
  },
  {
    employeeCode: "DEMO010",
    email: "demo.faculty06@demo.invalid",
    name: "Mira Rao",
    designation: "Assistant Professor",
    role: Role.FACULTY,
    department: demoInformationTechnology,
  },
  {
    employeeCode: "DEMO011",
    email: "demo.faculty07@demo.invalid",
    name: "Nila Desai",
    designation: "Assistant Professor",
    role: Role.FACULTY,
    department: demoInformationTechnology,
  },
] as const;

const examTime = (hour: number) =>
  new Date(Date.UTC(1970, 0, 1, hour, 0, 0));

const dateOffset = (days: number) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

const examFixtures = [
  {
    examName: "DEMO — Data Systems (Upcoming)",
    examDate: dateOffset(7),
    sessionName: "Morning",
    startTime: examTime(9),
    endTime: examTime(12),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    examName: "DEMO — Network Security (Upcoming)",
    examDate: dateOffset(14),
    sessionName: "Afternoon",
    startTime: examTime(13),
    endTime: examTime(16),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    examName: "DEMO — Software Design (Active)",
    examDate: dateOffset(0),
    sessionName: "Morning",
    startTime: examTime(9),
    endTime: examTime(12),
    requiredFaculty: 2,
    status: ExamStatus.ACTIVE,
  },
  {
    examName: "DEMO — Database Concepts (Completed)",
    examDate: dateOffset(-14),
    sessionName: "Morning",
    startTime: examTime(9),
    endTime: examTime(12),
    requiredFaculty: 3,
    status: ExamStatus.COMPLETED,
  },
  {
    examName: "DEMO — Applied Computing (Cancelled)",
    examDate: dateOffset(21),
    sessionName: "Afternoon",
    startTime: examTime(13),
    endTime: examTime(16),
    requiredFaculty: 2,
    status: ExamStatus.CANCELLED,
  },
] as const;

async function main() {
  console.log("🧪 Creating synthetic site demo data...");
  const hashedPassword = await bcrypt.hash(demoPassword!, 10);

  const departments = new Map<string, { id: string }>();
  for (const name of demoDepartments) {
    const existing = await prisma.department.findUnique({ where: { name }, select: { id: true } });
    const department = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
      select: { id: true },
    });
    recordRow("departments", Boolean(existing));
    departments.set(name, department);
  }

  const employees = new Map<string, { id: string }>();
  for (const fixture of employeeFixtures) {
    const department = departments.get(fixture.department);
    if (!department) throw new Error(`Demo department '${fixture.department}' missing.`);

    const byCode = await prisma.employee.findUnique({
      where: { employeeCode: fixture.employeeCode },
      select: { id: true, email: true },
    });
    const byEmail = await prisma.employee.findUnique({
      where: { email: fixture.email },
      select: { id: true, employeeCode: true },
    });

    if (byCode && byCode.email !== fixture.email) {
      throw new Error(`Demo employee code '${fixture.employeeCode}' is already in use.`);
    }
    if (byEmail && byEmail.employeeCode !== fixture.employeeCode) {
      throw new Error(`Demo email '${fixture.email}' is already in use.`);
    }

    recordRow("employees", Boolean(byCode));
    const employee = await prisma.employee.upsert({
      where: { employeeCode: fixture.employeeCode },
      update: {},
      create: {
        employeeCode: fixture.employeeCode,
        email: fixture.email,
        name: fixture.name,
        designation: fixture.designation,
        role: fixture.role,
        loginProvider: LoginProvider.LOCAL,
        isEmailVerified: true,
        password: hashedPassword,
        departmentId: department.id,
      },
      select: { id: true },
    });
    employees.set(fixture.employeeCode, employee);
  }

  const exams = new Map<string, { id: string }>();
  for (const fixture of examFixtures) {
    const existing = await prisma.exam.findUnique({
      where: { examName: fixture.examName },
      select: { id: true },
    });
    const exam = await prisma.exam.upsert({
      where: { examName: fixture.examName },
      update: {},
      create: fixture,
      select: { id: true },
    });
    recordRow("exams", Boolean(existing));
    exams.set(fixture.examName, exam);
  }

  async function ensureDuty(employeeCode: string, examName: string, status: DutyStatus) {
    const employee = employees.get(employeeCode);
    const exam = exams.get(examName);
    if (!employee || !exam) throw new Error(`Missing demo duty reference: ${employeeCode}/${examName}.`);

    const existing = await prisma.examDuty.findFirst({
      where: { employeeId: employee.id, examId: exam.id },
      select: { id: true },
    });
    if (existing) {
      recordRow("exam duties", true);
      return existing;
    }

    recordRow("exam duties", false);
    return prisma.examDuty.create({
      data: { employeeId: employee.id, examId: exam.id, status },
      select: { id: true },
    });
  }

  const dutyPairs = [
    ["DEMO005", "DEMO — Data Systems (Upcoming)", DutyStatus.ASSIGNED],
    ["DEMO006", "DEMO — Data Systems (Upcoming)", DutyStatus.ASSIGNED],
    ["DEMO008", "DEMO — Data Systems (Upcoming)", DutyStatus.ASSIGNED],
    ["DEMO007", "DEMO — Network Security (Upcoming)", DutyStatus.ASSIGNED],
    ["DEMO009", "DEMO — Network Security (Upcoming)", DutyStatus.ASSIGNED],
    ["DEMO010", "DEMO — Network Security (Upcoming)", DutyStatus.ASSIGNED],
    ["DEMO005", "DEMO — Software Design (Active)", DutyStatus.ASSIGNED],
    ["DEMO009", "DEMO — Software Design (Active)", DutyStatus.ATTENDED],
    ["DEMO006", "DEMO — Database Concepts (Completed)", DutyStatus.ATTENDED],
    ["DEMO007", "DEMO — Database Concepts (Completed)", DutyStatus.ATTENDED],
    ["DEMO010", "DEMO — Database Concepts (Completed)", DutyStatus.ABSENT],
    ["DEMO008", "DEMO — Applied Computing (Cancelled)", DutyStatus.ASSIGNED],
  ] as const;

  const duties = new Map<string, { id: string }>();
  for (const [employeeCode, examName, status] of dutyPairs) {
    duties.set(`${employeeCode}:${examName}`, await ensureDuty(employeeCode, examName, status));
  }

  const hodIt = employees.get("DEMO004");
  const optIns = [
    {
      employeeCode: "DEMO010",
      examName: "DEMO — Data Systems (Upcoming)",
      status: ExamOptInStatus.PENDING,
    },
    {
      employeeCode: "DEMO009",
      examName: "DEMO — Data Systems (Upcoming)",
      status: ExamOptInStatus.CONFIRMED,
      reviewedById: hodIt?.id,
      reviewedAt: new Date(),
      reviewRemark: "Confirmed for the demonstration scenario.",
    },
  ];
  for (const optIn of optIns) {
    const employee = employees.get(optIn.employeeCode);
    const exam = exams.get(optIn.examName);
    if (!employee || !exam) throw new Error("Missing demo opt-in reference.");
    const existing = await prisma.examOptIn.findUnique({
      where: { employeeId_examId: { employeeId: employee.id, examId: exam.id } },
      select: { id: true },
    });
    await prisma.examOptIn.upsert({
      where: { employeeId_examId: { employeeId: employee.id, examId: exam.id } },
      update: {},
      create: {
        employeeId: employee.id,
        examId: exam.id,
        status: optIn.status,
        ...(optIn.status === ExamOptInStatus.CONFIRMED
          ? {
              reviewedById: optIn.reviewedById,
              reviewedAt: optIn.reviewedAt,
              reviewRemark: optIn.reviewRemark,
            }
          : {}),
      },
    });
    recordRow("exam opt-ins", Boolean(existing));
  }

  const coe = employees.get("DEMO002");
  const transferFixtures = [
    {
      fromCode: "DEMO005",
      examName: "DEMO — Data Systems (Upcoming)",
      status: TransferStatus.PENDING,
      requestType: TransferRequestType.NEEDS_ASSISTANCE,
      reason: "Schedule conflict in the demonstration scenario.",
      toCode: null,
      approvedById: null,
      approvalRemark: null,
    },
    {
      fromCode: "DEMO007",
      examName: "DEMO — Network Security (Upcoming)",
      status: TransferStatus.ACCEPTED,
      requestType: TransferRequestType.REPLACEMENT_FOUND,
      reason: "Replacement offered for the demonstration scenario.",
      toCode: "DEMO011",
      approvedById: null,
      approvalRemark: null,
    },
  ];

  const transferRows: Array<{ id: string; employeeId: string; requestId: string; status: TransferStatus }> = [];
  for (const fixture of transferFixtures) {
    const fromEmployee = employees.get(fixture.fromCode);
    const duty = duties.get(`${fixture.fromCode}:${fixture.examName}`);
    if (!fromEmployee || !duty) throw new Error("Missing demo transfer reference.");

    const existing = await prisma.transferRequest.findFirst({
      where: { examDutyId: duty.id, fromEmployeeId: fromEmployee.id },
      select: { id: true, status: true },
    });
    recordRow("transfer requests", Boolean(existing));
    const toEmployee = fixture.toCode ? employees.get(fixture.toCode) : null;
    if (fixture.toCode && !toEmployee) throw new Error(`Missing demo replacement '${fixture.toCode}'.`);
    const request = existing ?? await prisma.transferRequest.create({
      data: {
        fromEmployeeId: fromEmployee.id,
        toEmployeeId: toEmployee?.id ?? null,
        examDutyId: duty.id,
        status: fixture.status,
        requestType: fixture.requestType,
        reason: fixture.reason,
        approvedById: fixture.approvedById,
        approvalRemark: fixture.approvalRemark,
      },
      select: { id: true, status: true },
    });
    transferRows.push({
      id: request.id,
      employeeId: fromEmployee.id,
      requestId: request.id,
      status: request.status,
    });
  }

  const swapFixtures = [
    {
      requesterCode: "DEMO006",
      requesterExam: "DEMO — Data Systems (Upcoming)",
      receiverCode: "DEMO007",
      receiverExam: "DEMO — Network Security (Upcoming)",
      status: SwapStatus.PENDING,
      reason: "Request to exchange schedules in the demo scenario.",
      approvedById: null,
      approvalRemark: null,
      approvedAt: null,
    },
    {
      requesterCode: "DEMO008",
      requesterExam: "DEMO — Data Systems (Upcoming)",
      receiverCode: "DEMO009",
      receiverExam: "DEMO — Network Security (Upcoming)",
      status: SwapStatus.REJECTED,
      reason: "Conflicting schedules in the demo scenario.",
      approvedById: coe?.id ?? null,
      approvalRemark: "Rejected for demonstration reporting.",
      approvedAt: new Date(),
    },
  ];

  const swapRows: Array<{ id: string; employeeId: string; requestId: string; status: SwapStatus }> = [];
  for (const fixture of swapFixtures) {
    const requester = employees.get(fixture.requesterCode);
    const receiver = employees.get(fixture.receiverCode);
    const requesterDuty = duties.get(`${fixture.requesterCode}:${fixture.requesterExam}`);
    const receiverDuty = duties.get(`${fixture.receiverCode}:${fixture.receiverExam}`);
    if (!requester || !receiver || !requesterDuty || !receiverDuty) {
      throw new Error("Missing demo swap reference.");
    }

    const existing = await prisma.swapRequest.findFirst({
      where: { requesterDutyId: requesterDuty.id, receiverDutyId: receiverDuty.id },
      select: { id: true, status: true },
    });
    recordRow("swap requests", Boolean(existing));
    const request = existing ?? await prisma.swapRequest.create({
      data: {
        requesterId: requester.id,
        receiverId: receiver.id,
        requesterDutyId: requesterDuty.id,
        receiverDutyId: receiverDuty.id,
        status: fixture.status,
        reason: fixture.reason,
        approvedById: fixture.approvedById,
        approvalRemark: fixture.approvalRemark,
        approvedAt: fixture.approvedAt,
      },
      select: { id: true, status: true },
    });
    swapRows.push({
      id: request.id,
      employeeId: requester.id,
      requestId: request.id,
      status: request.status,
    });
  }

  for (const transfer of transferRows) {
    const title = "Demo transfer request";
    const message = `A demo transfer request is ${transfer.status.toLowerCase()}.`;
    const existing = await prisma.notification.findFirst({
      where: { employeeId: transfer.employeeId, title, message },
      select: { id: true },
    });
    recordRow("notifications", Boolean(existing));
    if (!existing) await prisma.notification.create({ data: { employeeId: transfer.employeeId, title, message } });

    const action = transferActivityAction(transfer.status);
    const activity = await prisma.activityLog.findFirst({
      where: { employeeId: transfer.employeeId, action, entityId: transfer.requestId },
      select: { id: true },
    });
    recordRow("activity logs", Boolean(activity));
    if (!activity) {
      await prisma.activityLog.create({
        data: {
          employeeId: transfer.employeeId,
          action,
          description: `Demo transfer request (${transfer.status.toLowerCase()}).`,
          entityType: EntityType.TRANSFER_REQUEST,
          entityId: transfer.requestId,
        },
      });
    }

    await ensureApprovalRequest({
      employeeId: transfer.employeeId,
      requestId: transfer.requestId,
      requestType: RequestType.TRANSFER,
      status: transferApprovalStatus(transfer.status),
    });
  }

  for (const swap of swapRows) {
    const title = "Demo swap request";
    const message = `A demo swap request is ${swap.status.toLowerCase()}.`;
    const existing = await prisma.notification.findFirst({
      where: { employeeId: swap.employeeId, title, message },
      select: { id: true },
    });
    recordRow("notifications", Boolean(existing));
    if (!existing) await prisma.notification.create({ data: { employeeId: swap.employeeId, title, message } });

    const action = swapActivityAction(swap.status);
    const activity = await prisma.activityLog.findFirst({
      where: { employeeId: swap.employeeId, action, entityId: swap.requestId },
      select: { id: true },
    });
    recordRow("activity logs", Boolean(activity));
    if (!activity) {
      await prisma.activityLog.create({
        data: {
          employeeId: swap.employeeId,
          action,
          description: `Demo swap request (${swap.status.toLowerCase()}).`,
          entityType: EntityType.SWAP_REQUEST,
          entityId: swap.requestId,
        },
      });
    }

    await ensureApprovalRequest({
      employeeId: swap.employeeId,
      requestId: swap.requestId,
      requestType: RequestType.SWAP,
      status: swapApprovalStatus(swap.status),
    });
  }

  console.log("✅ Demo data is ready.");
  console.log("Rows created / already present:");
  for (const [name, counts] of Object.entries(rowCounts)) {
    console.log(`- ${name}: ${counts.created} created, ${counts.alreadyPresent} already present`);
  }
  console.log("Already-present rows were reused without updates.");
  console.log("Demo accounts:");
  for (const employee of employeeFixtures) {
    console.log(`- ${employee.role}: ${employee.email}`);
  }
  console.log("New demo accounts use the DEMO_PASSWORD supplied for this run; existing passwords are preserved.");
}

async function ensureApprovalRequest(input: {
  employeeId: string;
  requestId: string;
  requestType: RequestType;
  status: ApprovalStatus;
}) {
  const existing = await prisma.approvalRequest.findFirst({
    where: { requestType: input.requestType, requestId: input.requestId },
    select: { id: true },
  });
  recordRow("approval requests", Boolean(existing));
  if (!existing) {
    await prisma.approvalRequest.create({
      data: {
        employeeId: input.employeeId,
        requestType: input.requestType,
        requestId: input.requestId,
        status: input.status,
      },
    });
  }
}

function transferActivityAction(status: TransferStatus): ActivityAction {
  switch (status) {
    case TransferStatus.PENDING:
    case TransferStatus.ACCEPTED:
      return ActivityAction.CREATE_TRANSFER_REQUEST;
    case TransferStatus.APPROVED:
      return ActivityAction.APPROVE_TRANSFER_REQUEST;
    case TransferStatus.REJECTED:
      return ActivityAction.REJECT_TRANSFER_REQUEST;
    case TransferStatus.CANCELLED:
      return ActivityAction.CANCEL_TRANSFER_REQUEST;
  }
}

function transferApprovalStatus(status: TransferStatus): ApprovalStatus {
  switch (status) {
    case TransferStatus.PENDING:
    case TransferStatus.ACCEPTED:
      return ApprovalStatus.PENDING;
    case TransferStatus.APPROVED:
      return ApprovalStatus.APPROVED;
    case TransferStatus.REJECTED:
    case TransferStatus.CANCELLED:
      return ApprovalStatus.REJECTED;
  }
}

function swapActivityAction(status: SwapStatus): ActivityAction {
  switch (status) {
    case SwapStatus.PENDING:
      return ActivityAction.CREATE_SWAP_REQUEST;
    case SwapStatus.ACCEPTED:
      return ActivityAction.ACCEPT_SWAP_REQUEST;
    case SwapStatus.APPROVED:
      return ActivityAction.APPROVE_SWAP_REQUEST;
    case SwapStatus.COMPLETED:
      return ActivityAction.COMPLETE_SWAP_REQUEST;
    case SwapStatus.REJECTED:
      return ActivityAction.REJECT_SWAP_REQUEST_BY_COE;
    case SwapStatus.CANCELLED:
      return ActivityAction.CANCEL_SWAP_REQUEST;
  }
}

function swapApprovalStatus(status: SwapStatus): ApprovalStatus {
  switch (status) {
    case SwapStatus.PENDING:
    case SwapStatus.ACCEPTED:
      return ApprovalStatus.PENDING;
    case SwapStatus.APPROVED:
    case SwapStatus.COMPLETED:
      return ApprovalStatus.APPROVED;
    case SwapStatus.REJECTED:
    case SwapStatus.CANCELLED:
      return ApprovalStatus.REJECTED;
  }
}

main()
  .catch((error) => {
    console.error("Demo data creation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
