import prisma from "../config/prisma.js";

import type { Prisma, Role } from "../generated/prisma/client.js";

import {
  employeeSelect,
  type EmployeeResponse,
} from "../constants/prismaSelect.js";

import type { Employee } from "../generated/prisma/client.js";

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

  async findAuthByEmail(email: string): Promise<Employee | null> {
    return prisma.employee.findFirst({
      where: {
        email,
        isDeleted: false,
      },
    });
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
  async findAll(): Promise<EmployeeResponse[]> {
    return prisma.employee.findMany({
      where: {
        isDeleted: false,
      },
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
