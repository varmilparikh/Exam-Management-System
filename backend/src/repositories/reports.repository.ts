import prisma from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import type { EmployeeReportQuery } from "../validators/reports.validator.js";

class ReportsRepository {
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
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new ReportsRepository();