import prisma from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import type { EmployeeReportQuery } from "../validators/reports.validator.js";
import type { WorkloadReportQuery } from "../validators/workloadReport.validator.js";
import type { ExamReportQuery } from "../validators/examReport.validator.js";
import type { TransferReportQuery } from "../validators/transferReport.validator.js";
import type { SwapReportQuery } from "../validators/swapReport.validator.js";
import type { DutyReportQuery } from "../validators/dutyReport.validator.js";
import type { ActivityReportQuery } from "../validators/activityReport.validator.js";
import {
  ExamStatus,
  TransferStatus,
  SwapStatus,
  DutyStatus,
  ActivityAction,
} from "../generated/prisma/client.js";

function dateRangeFilter(fromDate?: Date, toDate?: Date): Prisma.DateTimeFilter {
  return {
    ...(fromDate && { gte: fromDate }),
    ...(toDate && {
      lt: new Date(
        Date.UTC(
          toDate.getUTCFullYear(),
          toDate.getUTCMonth(),
          toDate.getUTCDate() + 1,
        ),
      ),
    }),
  };
}

function countRecordsByStatus<T extends string>(
  statuses: readonly T[],
  countForStatus: (status: T) => Promise<number>,
): Promise<Record<T, number>> {
  return Promise.all(
    statuses.map(async (status) => [status, await countForStatus(status)] as const),
  ).then((entries) => Object.fromEntries(entries) as Record<T, number>);
}

class ReportsRepository {
  async getReportsOverview() {
    const [employees, activeExams, upcomingExams, duties, pendingTransfers, transfers, pendingSwaps, completedSwaps, activityLogs, pendingOptIns, confirmedOptIns] = await Promise.all([
      prisma.employee.count({ where: { isDeleted: false, isActive: true } }),
      prisma.exam.count({ where: { isDeleted: false, status: ExamStatus.ACTIVE } }),
      prisma.exam.count({ where: { isDeleted: false, status: ExamStatus.UPCOMING } }),
      prisma.examDuty.count({ where: { isDeleted: false } }),
      prisma.transferRequest.count({ where: { isDeleted: false, status: TransferStatus.PENDING } }),
      prisma.transferRequest.count({ where: { isDeleted: false } }),
      prisma.swapRequest.count({ where: { isDeleted: false, status: SwapStatus.PENDING } }),
      prisma.swapRequest.count({ where: { isDeleted: false, status: SwapStatus.COMPLETED } }),
      prisma.activityLog.count({ where: { isDeleted: false } }),
      prisma.examOptIn.count({ where: { status: "PENDING" } }),
      prisma.examOptIn.count({ where: { status: "CONFIRMED" } }),
    ]);
    return { employees, activeExams, upcomingExams, duties, pendingTransfers, transfers, pendingSwaps, completedSwaps, activityLogs, pendingOptIns, confirmedOptIns };
  }

  async getEmployeeReport(filters: EmployeeReportQuery) {
    const {
      page,
      limit,
      search,
      departmentId,
      role,
      isActive,
      sortBy = "name",
      sortOrder = "asc",
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {
      isDeleted: false,

      ...(departmentId && { departmentId }),

      ...(role && { role }),

      ...(isActive !== undefined && { isActive }),

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            employeeCode: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const allowedSortFields = [
      "name",
      "employeeCode",
      "email",
      "attendedCount",
      "transferCount",
      "averageDuty",
      "createdAt",
    ] as const;

    const safeSortBy = allowedSortFields.includes(
      sortBy as (typeof allowedSortFields)[number],
    )
      ? sortBy
      : "name";

    const orderBy: Prisma.EmployeeOrderByWithRelationInput = {
      [safeSortBy]: sortOrder,
    };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy,

        select: {
          id: true,
          employeeCode: true,
          name: true,
          email: true,
          designation: true,
          role: true,
          isActive: true,
          attendedCount: true,
          transferCount: true,
          averageDuty: true,

          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      prisma.employee.count({
        where,
      }),
    ]);

    return {
      employees,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getFacultyWorkloadReport(filters: WorkloadReportQuery) {
    const { page, limit, search, departmentId, facultyId, fromDate, toDate } =
      filters;

    // --------------------------------------------------
    // Find faculty members
    // --------------------------------------------------

    const facultyWhere: Prisma.EmployeeWhereInput = {
      role: "FACULTY",
      isDeleted: false,

      ...(departmentId && {
        departmentId,
      }),

      ...(facultyId && {
        id: facultyId,
      }),

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            employeeCode: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const faculty = await prisma.employee.findMany({
      where: facultyWhere,

      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,

        department: {
          select: {
            name: true,
          },
        },
      },

      orderBy: {
        name: "asc",
      },
    });

    const facultyIds = faculty.map((employee) => employee.id);

    // --------------------------------------------------
    // Find duties belonging to those faculty members
    // --------------------------------------------------

    const examDateFilter: Prisma.DateTimeFilter = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && {
        lt: new Date(
          Date.UTC(
            toDate.getUTCFullYear(),
            toDate.getUTCMonth(),
            toDate.getUTCDate() + 1,
          ),
        ),
      }),
    };

    const examDutyWhere: Prisma.ExamDutyWhereInput = {
      isDeleted: false,

      employeeId: {
        in: facultyIds,
      },

      exam: {
        isDeleted: false,
        ...(fromDate || toDate ? { examDate: examDateFilter } : {}),
      },
    };

    const duties = await prisma.examDuty.findMany({
      where: examDutyWhere,

      select: {
        employeeId: true,
        status: true,
      },
    });

    // --------------------------------------------------
    // Prepare counters for every faculty member
    // --------------------------------------------------

    const dutyCounts = new Map<
      string,
      {
        totalDuties: number;
        assignedCount: number;
        attendedCount: number;
        absentCount: number;
        transferCount: number;
      }
    >();

    for (const employee of faculty) {
      dutyCounts.set(employee.id, {
        totalDuties: 0,
        assignedCount: 0,
        attendedCount: 0,
        absentCount: 0,
        transferCount: 0,
      });
    }

    // --------------------------------------------------
    // Aggregate duties
    // --------------------------------------------------

    for (const duty of duties) {
      if (!duty.employeeId) {
        continue;
      }

      const counts = dutyCounts.get(duty.employeeId);

      if (!counts) {
        continue;
      }

      counts.totalDuties += 1;

      switch (duty.status) {
        case "ASSIGNED":
          counts.assignedCount += 1;
          break;

        case "ATTENDED":
          counts.attendedCount += 1;
          break;

        case "ABSENT":
          counts.absentCount += 1;
          break;

        case "TRANSFERRED":
          counts.transferCount += 1;
          break;
      }
    }

    // --------------------------------------------------
    // Build report rows
    // --------------------------------------------------

    const rows = faculty.map((employee) => {
      const counts = dutyCounts.get(employee.id)!;

      return {
        employeeId: employee.id,
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        department: employee.department.name,

        totalDuties: counts.totalDuties,
        assignedCount: counts.assignedCount,
        attendedCount: counts.attendedCount,
        absentCount: counts.absentCount,
        transferCount: counts.transferCount,
      };
    });

    // --------------------------------------------------
    // Sorting
    // --------------------------------------------------

    const allowedSortFields = [
      "employeeCode",
      "name",
      "totalDuties",
      "assignedCount",
      "attendedCount",
      "absentCount",
      "transferCount",
    ] as const;

    const safeSortBy = allowedSortFields.includes(
      filters.sortBy as (typeof allowedSortFields)[number],
    )
      ? filters.sortBy
      : "name";

    const direction = filters.sortOrder === "desc" ? -1 : 1;

    rows.sort((a, b) => {
      const aValue = a[safeSortBy as keyof typeof a];
      const bValue = b[safeSortBy as keyof typeof b];

      const comparison =
        typeof aValue === "number" && typeof bValue === "number"
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue));

      return comparison * direction || a.name.localeCompare(b.name);
    });

    // --------------------------------------------------
    // Summary
    // --------------------------------------------------

    const totalFaculty = rows.length;

    const totalDuties = rows.reduce((sum, row) => sum + row.totalDuties, 0);

    const totalAssigned = rows.reduce((sum, row) => sum + row.assignedCount, 0);

    const totalAttended = rows.reduce((sum, row) => sum + row.attendedCount, 0);

    const totalAbsent = rows.reduce((sum, row) => sum + row.absentCount, 0);

    const totalTransferred = rows.reduce(
      (sum, row) => sum + row.transferCount,
      0,
    );

    const averageDutiesPerFaculty =
      totalFaculty > 0 ? Number((totalDuties / totalFaculty).toFixed(2)) : 0;

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const total = rows.length;

    const skip = (page - 1) * limit;

    const paginatedRows = rows.slice(skip, skip + limit);

    return {
      rows: paginatedRows,

      summary: {
        totalFaculty,
        totalDuties,
        totalAssigned,
        totalAttended,
        totalAbsent,
        totalTransferred,
        averageDutiesPerFaculty,
      },

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getExamReport(filters: ExamReportQuery) {
    const { page, limit, search, status, sortBy, sortOrder, fromDate, toDate } =
      filters;

    const where: Prisma.ExamWhereInput = {
      isDeleted: false,
      ...(search && {
        examName: { contains: search, mode: "insensitive" },
      }),
      ...(fromDate || toDate
        ? { examDate: dateRangeFilter(fromDate, toDate) }
        : {}),
    };
    const queryWhere: Prisma.ExamWhereInput = {
      ...where,
      ...(status && { status }),
    };

    const sortFields = [
      "examName",
      "examDate",
      "requiredFaculty",
      "status",
      "createdAt",
    ] as const;
    const safeSortBy = sortFields.includes(
      sortBy as (typeof sortFields)[number],
    )
      ? (sortBy as (typeof sortFields)[number])
      : "examDate";

    const [exams, total, statusCounts] = await Promise.all([
      prisma.exam.findMany({
        where: queryWhere,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        select: {
          id: true,
          examName: true,
          examDate: true,
          requiredFaculty: true,
          status: true,
          createdAt: true,
          sessionName: true,
          startTime: true,
          endTime: true,
          duties: { where: { isDeleted: false, employeeId: { not: null } }, select: { id: true } },
        },
      }),
      prisma.exam.count({ where: queryWhere }),
      countRecordsByStatus(Object.values(ExamStatus) as ExamStatus[], (examStatus) =>
        prisma.exam.count({ where: { ...queryWhere, status: examStatus } }),
      ),
    ]);

    return {
      rows: exams.map(({ duties, ...exam }) => ({
        ...exam,
        assignedFaculty: duties.length,
        remainingPositions: Math.max(0, exam.requiredFaculty - duties.length),
      })),
      summary: { total, statusCounts },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getDutyReport(filters: DutyReportQuery) {
    const { page, limit, search, status, fromDate, toDate, departmentId, employeeId, sortBy = "examDate", sortOrder = "asc" } = filters;
    const where: Prisma.ExamDutyWhereInput = {
      isDeleted: false,
      ...(status && { status }),
      ...(employeeId && { employeeId }),
      ...(departmentId && { employee: { departmentId } }),
      ...(search && { OR: [
        { employee: { name: { contains: search, mode: "insensitive" } } },
        { employee: { employeeCode: { contains: search, mode: "insensitive" } } },
        { exam: { examName: { contains: search, mode: "insensitive" } } },
      ] }),
      ...((fromDate || toDate) && { exam: { examDate: dateRangeFilter(fromDate, toDate) } }),
    };
    const orderBy = sortBy === "status" ? { status: sortOrder } as const : { exam: { examDate: sortOrder } } as const;
    const [duties, total, statusCounts] = await Promise.all([
      prisma.examDuty.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy, select: {
        id: true, status: true,
        employee: { select: { id: true, name: true, department: { select: { name: true } } } },
        exam: { select: { id: true, examName: true, examDate: true, sessionName: true, startTime: true, endTime: true } },
      } }),
      prisma.examDuty.count({ where }),
      countRecordsByStatus(Object.values(DutyStatus) as DutyStatus[], (dutyStatus) => prisma.examDuty.count({ where: { ...where, status: dutyStatus } })),
    ]);
    return { rows: duties, summary: { total, statusCounts }, pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  }

  async getActivityReport(filters: ActivityReportQuery) {
    const { page, limit, search, action, fromDate, toDate } = filters;
    const where: Prisma.ActivityLogWhereInput = {
      isDeleted: false,
      ...(action && { action }),
      ...(search && { OR: [
        { description: { contains: search, mode: "insensitive" } },
        { employee: { name: { contains: search, mode: "insensitive" } } },
      ] }),
      ...((fromDate || toDate) && { createdAt: dateRangeFilter(fromDate, toDate) }),
    };
    const [logs, total, actionCounts] = await Promise.all([
      prisma.activityLog.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" }, select: {
        id: true, action: true, description: true, entityType: true, entityId: true, createdAt: true,
        employee: { select: { id: true, name: true, employeeCode: true } },
      } }),
      prisma.activityLog.count({ where }),
      countRecordsByStatus(Object.values(ActivityAction) as ActivityAction[], (activityAction) => prisma.activityLog.count({ where: { ...where, action: activityAction } })),
    ]);
    return { rows: logs, summary: { total, actionCounts }, pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  }

  async getTransferReport(filters: TransferReportQuery) {
    const { page, limit, search, status, sortBy, sortOrder, fromDate, toDate } =
      filters;

    const where: Prisma.TransferRequestWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          {
            examDuty: {
              exam: { examName: { contains: search, mode: "insensitive" } },
            },
          },
          { fromEmployee: { name: { contains: search, mode: "insensitive" } } },
          { toEmployee: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(fromDate || toDate
        ? { createdAt: dateRangeFilter(fromDate, toDate) }
        : {}),
    };
    const queryWhere: Prisma.TransferRequestWhereInput = {
      ...where,
      ...(status && { status }),
    };

    const sortFields = ["createdAt", "approvedAt", "status"] as const;
    const safeSortBy = sortFields.includes(
      sortBy as (typeof sortFields)[number],
    )
      ? (sortBy as (typeof sortFields)[number])
      : "createdAt";

    const [requests, total, statusCounts] = await Promise.all([
      prisma.transferRequest.findMany({
        where: queryWhere,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        select: {
          id: true,
          status: true,
          requestType: true,
          reason: true,
          createdAt: true,
          approvedAt: true,
          fromEmployee: { select: { id: true, employeeCode: true, name: true } },
          toEmployee: { select: { id: true, employeeCode: true, name: true } },
          approvedBy: { select: { id: true, employeeCode: true, name: true } },
          examDuty: {
            select: { exam: { select: { id: true, examName: true, examDate: true } } },
          },
        },
      }),
      prisma.transferRequest.count({ where: queryWhere }),
      countRecordsByStatus(Object.values(TransferStatus) as TransferStatus[], (requestStatus) =>
        prisma.transferRequest.count({ where: { ...queryWhere, status: requestStatus } }),
      ),
    ]);

    return {
      rows: requests,
      summary: { total, statusCounts },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getSwapReport(filters: SwapReportQuery) {
    const { page, limit, search, status, sortBy, sortOrder, fromDate, toDate } =
      filters;

    const where: Prisma.SwapRequestWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          { requester: { name: { contains: search, mode: "insensitive" } } },
          { receiver: { name: { contains: search, mode: "insensitive" } } },
          {
            requesterDuty: {
              exam: { examName: { contains: search, mode: "insensitive" } },
            },
          },
          {
            receiverDuty: {
              exam: { examName: { contains: search, mode: "insensitive" } },
            },
          },
        ],
      }),
      ...(fromDate || toDate
        ? { createdAt: dateRangeFilter(fromDate, toDate) }
        : {}),
    };
    const queryWhere: Prisma.SwapRequestWhereInput = {
      ...where,
      ...(status && { status }),
    };

    const sortFields = ["createdAt", "approvedAt", "status"] as const;
    const safeSortBy = sortFields.includes(
      sortBy as (typeof sortFields)[number],
    )
      ? (sortBy as (typeof sortFields)[number])
      : "createdAt";

    const [requests, total, statusCounts] = await Promise.all([
      prisma.swapRequest.findMany({
        where: queryWhere,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        select: {
          id: true,
          status: true,
          reason: true,
          createdAt: true,
          completedAt: true,
          requester: { select: { id: true, employeeCode: true, name: true } },
          receiver: { select: { id: true, employeeCode: true, name: true } },
          requesterDuty: {
            select: { exam: { select: { id: true, examName: true, examDate: true, sessionName: true, startTime: true, endTime: true } } },
          },
          receiverDuty: {
            select: { exam: { select: { id: true, examName: true, examDate: true, sessionName: true, startTime: true, endTime: true } } },
          },
        },
      }),
      prisma.swapRequest.count({ where: queryWhere }),
      countRecordsByStatus(Object.values(SwapStatus) as SwapStatus[], (requestStatus) =>
        prisma.swapRequest.count({ where: { ...queryWhere, status: requestStatus } }),
      ),
    ]);

    return {
      rows: requests,
      summary: { total, statusCounts },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }
}

export default new ReportsRepository();
