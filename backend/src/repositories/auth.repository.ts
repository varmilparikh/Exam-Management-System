import prisma from "../config/prisma.js";
import type { Prisma, Employee } from "../generated/prisma/client.js";

class AuthRepository {
  async findByEmail(email: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { email },
    });
  }

  async findByEmployeeCode(
    employeeCode: string
  ): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { employeeCode },
    });
  }

  async create(
    data: Prisma.EmployeeCreateInput
  ): Promise<Employee> {
    return prisma.employee.create({
      data,
    });
  }
}

export default new AuthRepository();