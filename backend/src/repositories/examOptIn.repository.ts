import prisma from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { ExamOptInStatus, ExamStatus, DutyStatus, Role } from "../generated/prisma/client.js";
import { examOptInSelect, type ExamOptInResponse } from "../constants/prismaSelect.js";
import { hasSessionStarted } from "../utils/examSession.utils.js";
import { ApiError } from "../utils/apiError.js";

const activeOptInStatuses = [ExamOptInStatus.PENDING, ExamOptInStatus.CONFIRMED];

export class ExamOptInRepository {
  constructor(private readonly database: typeof prisma = prisma) {}

  async findUpcomingForFaculty(employeeId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const exams = await prisma.exam.findMany({
      where: { isDeleted: false, status: ExamStatus.UPCOMING, examDate: { gte: today } },
      orderBy: [{ examDate: "asc" }, { startTime: "asc" }],
      select: {
        id: true,
        examName: true,
        examDate: true,
        sessionName: true,
        startTime: true,
        endTime: true,
        requiredFaculty: true,
        status: true,
        duties: {
          where: { isDeleted: false, employeeId: { not: null } },
          select: { id: true },
        },
        optIns: {
          where: { status: { in: activeOptInStatuses } },
          select: { id: true, employeeId: true, status: true },
        },
      },
    });

    return exams
      .filter((exam) => !hasSessionStarted(exam))
      .map((exam) => {
        const assignedFaculty = exam.duties.length;
        const pendingOptIns = exam.optIns.filter((item) => item.status === ExamOptInStatus.PENDING).length;
        const myOptInRecord = exam.optIns.find((item) => item.employeeId === employeeId);
        return {
          id: exam.id,
          examName: exam.examName,
          examDate: exam.examDate,
          sessionName: exam.sessionName,
          startTime: exam.startTime,
          endTime: exam.endTime,
          requiredFaculty: exam.requiredFaculty,
          status: exam.status,
          assignedFaculty,
          optedInFaculty: pendingOptIns,
          availablePositions: Math.max(0, exam.requiredFaculty - assignedFaculty - pendingOptIns),
          myOptIn: myOptInRecord?.status ?? null,
          myOptInId: myOptInRecord?.id ?? null,
        };
      });
  }

  async createOrReopen(employeeId: string, examId: string): Promise<ExamOptInResponse> {
    try {
      return await prisma.$transaction(async (tx) => {
        const exam = await tx.exam.findFirst({
          where: { id: examId, isDeleted: false },
          select: {
            id: true,
            examDate: true,
            startTime: true,
            endTime: true,
            requiredFaculty: true,
            status: true,
          },
        });
        if (!exam) throw new ApiError(404, "Exam not found.");
        if (exam.status !== ExamStatus.UPCOMING || hasSessionStarted(exam)) {
          throw new ApiError(409, "Opt-in is closed for this exam session.");
        }

        const existing = await tx.examOptIn.findUnique({
          where: { employeeId_examId: { employeeId, examId } },
          select: { id: true, status: true },
        });
        if (existing?.status === ExamOptInStatus.PENDING || existing?.status === ExamOptInStatus.CONFIRMED) {
          throw new ApiError(409, "You have already opted in for this exam session.");
        }

        const assignedCount = await tx.examDuty.count({
          where: { examId, isDeleted: false, employeeId: { not: null } },
        });
        const pendingCount = await tx.examOptIn.count({
          where: { examId, status: ExamOptInStatus.PENDING },
        });
        if (assignedCount + pendingCount >= exam.requiredFaculty) {
          throw new ApiError(409, "This exam session has reached its opt-in capacity.");
        }

        const conflictingDuty = await tx.examDuty.findFirst({
          where: {
            employeeId,
            isDeleted: false,
            exam: {
              isDeleted: false,
              examDate: exam.examDate,
              startTime: { lt: exam.endTime },
              endTime: { gt: exam.startTime },
            },
          },
          select: { id: true },
        });
        const conflictingOptIn = await tx.examOptIn.findFirst({
          where: {
            employeeId,
            examId: { not: examId },
            status: { in: activeOptInStatuses },
            exam: {
              isDeleted: false,
              examDate: exam.examDate,
              startTime: { lt: exam.endTime },
              endTime: { gt: exam.startTime },
            },
          },
          select: { id: true },
        });
        if (conflictingDuty || conflictingOptIn) {
          throw new ApiError(409, "You already have a duty or opt-in during this session.");
        }

        if (existing) {
          return tx.examOptIn.update({
            where: { id: existing.id },
            data: { status: ExamOptInStatus.PENDING, reviewedById: null, reviewedAt: null, reviewRemark: null },
            select: examOptInSelect,
          });
        }
        return tx.examOptIn.create({
          data: { employeeId, examId, status: ExamOptInStatus.PENDING },
          select: examOptInSelect,
        });
      }, { isolationLevel: "Serializable" });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2034") {
        throw new ApiError(409, "The session changed while you opted in. Please retry.");
      }
      throw error;
    }
  }

  async cancelPending(employeeId: string, id: string): Promise<ExamOptInResponse> {
    const updated = await prisma.examOptIn.updateMany({
      where: { id, employeeId, status: ExamOptInStatus.PENDING },
      data: { status: ExamOptInStatus.CANCELLED },
    });
    if (updated.count !== 1) {
      const optIn = await prisma.examOptIn.findFirst({
        where: { id, employeeId },
        select: { id: true },
      });
      if (!optIn) throw new ApiError(404, "Opt-in not found.");
      throw new ApiError(409, "Only pending opt-ins can be cancelled.");
    }

    return prisma.examOptIn.findUniqueOrThrow({
      where: { id },
      select: examOptInSelect,
    });
  }

  async list(filters: { status?: ExamOptInStatus; examId?: string; departmentId?: string; role: Role; employeeId: string }) {
    const departmentId = filters.role === Role.HOD
      ? await this.getDepartmentId(filters.employeeId)
      : filters.departmentId;
    if (filters.role === Role.HOD && !departmentId) throw new ApiError(404, "Department not found.");
    const where: Prisma.ExamOptInWhereInput = {
      ...(filters.status && { status: filters.status }),
      ...(filters.examId && { examId: filters.examId }),
      ...(departmentId && { employee: { departmentId } }),
    };
    return prisma.examOptIn.findMany({ where, orderBy: { createdAt: "desc" }, select: examOptInSelect });
  }

  private async getDepartmentId(employeeId: string): Promise<string | null> {
    const employee = await prisma.employee.findFirst({ where: { id: employeeId, isDeleted: false }, select: { departmentId: true } });
    return employee?.departmentId ?? null;
  }

  async review(id: string, reviewerId: string, action: "CONFIRM" | "REJECT", remark?: string): Promise<ExamOptInResponse> {
    try {
      return await this.database.$transaction(async (tx) => {
        const optIn = await tx.examOptIn.findUnique({
          where: { id },
          select: {
            id: true,
            employeeId: true,
            examId: true,
            status: true,
            exam: { select: { examDate: true, startTime: true, endTime: true, requiredFaculty: true, status: true } },
          },
        });
        if (!optIn) throw new ApiError(404, "Opt-in not found.");
        if (optIn.status !== ExamOptInStatus.PENDING) throw new ApiError(409, "Only pending opt-ins can be reviewed.");
        if (action === "CONFIRM") {
          if (optIn.exam.status !== ExamStatus.UPCOMING || hasSessionStarted(optIn.exam)) {
            throw new ApiError(409, "This exam session is no longer open for confirmation.");
          }
          const existingDuty = await tx.examDuty.findFirst({
            where: {
              employeeId: optIn.employeeId,
              examId: optIn.examId,
              isDeleted: false,
            },
            select: { id: true },
          });
          if (existingDuty) {
            throw new ApiError(
              409,
              "Faculty is already assigned to this exam. Reject the opt-in instead.",
            );
          }
          const assignedCount = await tx.examDuty.count({ where: { examId: optIn.examId, isDeleted: false, employeeId: { not: null } } });
          if (assignedCount >= optIn.exam.requiredFaculty) throw new ApiError(409, "The exam session has no remaining capacity.");
          const conflictingDuty = await tx.examDuty.findFirst({
            where: {
              employeeId: optIn.employeeId,
              isDeleted: false,
              examId: { not: optIn.examId },
              exam: { isDeleted: false, examDate: optIn.exam.examDate, startTime: { lt: optIn.exam.endTime }, endTime: { gt: optIn.exam.startTime } },
            },
            select: { id: true },
          });
          const conflictingOptIn = await tx.examOptIn.findFirst({
            where: {
              employeeId: optIn.employeeId,
              id: { not: id },
              status: { in: activeOptInStatuses },
              exam: { isDeleted: false, examDate: optIn.exam.examDate, startTime: { lt: optIn.exam.endTime }, endTime: { gt: optIn.exam.startTime } },
            },
            select: { id: true },
          });
          if (conflictingDuty || conflictingOptIn) throw new ApiError(409, "Faculty has another duty or opt-in during this session.");
          await tx.examDuty.create({
            data: { employeeId: optIn.employeeId, examId: optIn.examId, status: DutyStatus.ASSIGNED },
          });
        }
        const updated = await tx.examOptIn.updateMany({
          where: { id, status: ExamOptInStatus.PENDING },
          data: {
            status: action === "CONFIRM" ? ExamOptInStatus.CONFIRMED : ExamOptInStatus.REJECTED,
            reviewedById: reviewerId,
            reviewedAt: new Date(),
            reviewRemark: remark,
          },
        });
        if (updated.count !== 1) {
          throw new ApiError(409, "Only pending opt-ins can be reviewed.");
        }
        return tx.examOptIn.findUniqueOrThrow({
          where: { id },
          select: examOptInSelect,
        });
      }, { isolationLevel: "Serializable" });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2034") {
        throw new ApiError(409, "The opt-in changed while it was being reviewed. Please retry.");
      }
      throw error;
    }
  }
}

export default new ExamOptInRepository();
