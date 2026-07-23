import prisma from "../config/prisma.js";

import type { Prisma } from "../generated/prisma/client.js";

import {
  departmentSelect,
  type DepartmentResponse,
} from "../constants/prismaSelect.js";

class DepartmentRepository {
  /**
   * Find department by ID
   */
  async findById(id: string): Promise<DepartmentResponse | null> {
    return prisma.department.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: departmentSelect,
    });
  }

  /**
   * Find department by name
   */
  async findByName(name: string): Promise<DepartmentResponse | null> {
    return prisma.department.findFirst({
      where: {
        name,
        isDeleted: false,
      },
      select: departmentSelect,
    });
  }

  /**
   * Check if department name already exists
   */
  async existsByName(name: string): Promise<boolean> {
    const count = await prisma.department.count({
      where: {
        name,
        isDeleted: false,
      },
    });

    return count > 0;
  }

  /**
   * Get all departments
   */
  async findAll(): Promise<DepartmentResponse[]> {
    return prisma.department.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        name: "asc",
      },
      select: departmentSelect,
    });
  }

  /**
   * Create department
   */
  async create(
    data: Prisma.DepartmentCreateInput,
  ): Promise<DepartmentResponse> {
    return prisma.department.create({
      data,
      select: departmentSelect,
    });
  }

  /**
   * Update department
   */
  async update(
    id: string,
    data: Prisma.DepartmentUpdateInput,
  ): Promise<DepartmentResponse> {
    return prisma.department.update({
      where: {
        id,
      },
      data,
      select: departmentSelect,
    });
  }

  /**
   * Soft delete department
   */
  async softDelete(id: string): Promise<DepartmentResponse> {
    return prisma.department.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      select: departmentSelect,
    });
  }

  /**
   * Check if department has active employees
   */
  async hasEmployees(id: string): Promise<boolean> {
    const count = await prisma.employee.count({
      where: {
        departmentId: id,
        isDeleted: false,
      },
    });

    return count > 0;
  }
}

export default new DepartmentRepository();
