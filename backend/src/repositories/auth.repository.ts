import prisma from "../config/prisma.js";
import type {
  Employee,
  Department,
  Prisma,
} from "../generated/prisma/client.js";

class AuthRepository {
  /**
   * Find employee using email
   */
  async findByEmail(email: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: {
        email,
      },
    });
  }

  /**
   * Find employee using employee code
   */
  async findByEmployeeCode(employeeCode: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: {
        employeeCode,
      },
    });
  }

  /**
   * Check department exists
   */
  async findDepartmentById(id: string): Promise<Department | null> {
    return prisma.department.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Create employee
   */
  async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    return prisma.employee.create({
      data,
    });
  }

  /**
   * Update employee last login time
   */
  async updateLastLogin(id: string): Promise<Employee> {
    return prisma.employee.update({
      where: {
        id,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }
}

export default new AuthRepository();
