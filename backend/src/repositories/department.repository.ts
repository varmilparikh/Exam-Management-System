import prisma from "../config/prisma.js";

import type {
  Department,
  Prisma,
} from "../generated/prisma/client.js";

class DepartmentRepository {
  /**
   * Find department by ID
   */
  async findById(
    id: string
  ): Promise<Department | null> {
    return prisma.department.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  /**
   * Find department by name
   */
  async findByName(
    name: string
  ): Promise<Department | null> {
    return prisma.department.findFirst({
      where: {
        name,
        isDeleted: false,
      },
    });
  }

  /**
   * Get all departments
   */
  async findAll(): Promise<Department[]> {
    return prisma.department.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Create department
   */
  async create(
    data: Prisma.DepartmentCreateInput
  ): Promise<Department> {
    return prisma.department.create({
      data,
    });
  }

  /**
   * Update department
   */
  async update(
    id: string,
    data: Prisma.DepartmentUpdateInput
  ): Promise<Department> {
    return prisma.department.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Soft delete department
   */
  async softDelete(
    id: string
  ): Promise<Department> {
    return prisma.department.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}

export default new DepartmentRepository();