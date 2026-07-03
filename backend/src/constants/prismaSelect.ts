import type { Prisma } from "../generated/prisma/client.js";

export const employeeSelect = {
  id: true,
  employeeCode: true,
  name: true,
  email: true,
  phone: true,
  loginProvider: true,
  isEmailVerified: true,
  lastLogin: true,
  profileImage: true,
  designation: true,
  role: true,
  averageDuty: true,
  attendedCount: true,
  transferCount: true,
  isActive: true,
  isDeleted: true,
  departmentId: true,
  createdAt: true,
  updatedAt: true,

  department: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.EmployeeSelect;

export type EmployeeResponse =
  Prisma.EmployeeGetPayload<{
    select: typeof employeeSelect;
  }>;