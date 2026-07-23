import prisma from "../config/prisma.js";
import type {
  Employee,
  Department,
  Prisma,
} from "../generated/prisma/client.js";

import {
  employeeLoginSelect,
  employeeSelect,
  type EmployeeLogin,
  type EmployeeResponse,
} from "../constants/prismaSelect.js";

class AuthRepository {
  /**
   * Find employee using email
   */
  async findByEmail(email: string): Promise<EmployeeLogin | null> {
    return prisma.employee.findFirst({
      where: {
        email,
        isDeleted: false,
      },
      select: employeeLoginSelect,
    });
  }

  /**
   * Find employee using employee code
   */
  async findByEmployeeCode(employeeCode: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: {
        employeeCode,
        isDeleted: false,
      },
    });
  }

  /**
   * Check department exists
   */
  async findDepartmentById(id: string): Promise<Department | null> {
    return prisma.department.findFirst({
      where: {
        id,
        isDeleted: false,
      },
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
   * Update employee last login time
   */
  async updateLastLogin(id: string): Promise<EmployeeResponse> {
    return prisma.employee.update({
      where: {
        id,
      },
      data: {
        lastLogin: new Date(),
      },
      select: employeeSelect,
    });
  }
}

export default new AuthRepository();
