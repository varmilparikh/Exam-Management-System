import prisma from "../config/prisma.js";

import type { Prisma, Role } from "../generated/prisma/client.js";

import {
  employeeSelect,
  type EmployeeResponse,
} from "../constants/prismaSelect.js";
import type { EmployeeFilters } from "../types/employeeFilter.types.js";

class EmployeeRepository {
  /**
   * Find employee by ID
   */
  async findById(id: string): Promise<EmployeeResponse | null> {
    return prisma.employee.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: employeeSelect,
    });
  }

  /**
   * Find employee by email
   */
  async findByEmail(email: string): Promise<EmployeeResponse | null> {
    return prisma.employee.findFirst({
      where: {
        email,
        isDeleted: false,
      },
      select: employeeSelect,
    });
  }

  /**
   * Check whether an email already exists
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.employee.count({
      where: {
        email,
        isDeleted: false,
      },
    });

    return count > 0;
  }

  /**
   * Find employee by employee code
   */
  async findByEmployeeCode(
    employeeCode: string,
  ): Promise<EmployeeResponse | null> {
    return prisma.employee.findFirst({
      where: {
        employeeCode,
        isDeleted: false,
      },
      select: employeeSelect,
    });
  }

  /**
   * Find employees by role
   */
  async findByRole(role: Role): Promise<EmployeeResponse[]> {
    return prisma.employee.findMany({
      where: {
        role,
        isActive: true,
        isDeleted: false,
      },
      select: employeeSelect,
    });
  }

  /**
   * Get all employees
   */
  async findAll(filters: EmployeeFilters): Promise<EmployeeResponse[]> {
    const where: Prisma.EmployeeWhereInput = {
      isDeleted: false,
    };

    if (filters.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          employeeCode: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (filters.departmentId) {
      where.departmentId = filters.departmentId;
    }

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.status === "ACTIVE") {
      where.isActive = true;
    }

    if (filters.status === "INACTIVE") {
      where.isActive = false;
    }

    return prisma.employee.findMany({
      where,

      orderBy: {
        name: "asc",
      },

      select: employeeSelect,
    });
  }

  /**
   * Create employee
   */
  async create(data: Prisma.EmployeeCreateInput): Promise<EmployeeResponse> {
    return prisma.employee.create({
      data,
      select: employeeSelect,
    });
  }

  /**
   * Update employee
   */
  async update(
    id: string,
    data: Prisma.EmployeeUpdateInput,
  ): Promise<EmployeeResponse> {
    return prisma.employee.update({
      where: {
        id,
      },
      data,
      select: employeeSelect,
    });
  }

  /**
   * Soft delete employee
   */
  async softDelete(id: string): Promise<EmployeeResponse> {
    return prisma.employee.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      select: employeeSelect,
    });
  }
}

export default new EmployeeRepository();
