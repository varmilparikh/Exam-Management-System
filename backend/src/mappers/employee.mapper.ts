import type { Employee } from "../generated/prisma/client.js";

export function toEmployeeResponse(employee: Employee) {
  return {
    id: employee.id,
    employeeCode: employee.employeeCode,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    profileImage: employee.profileImage,
    designation: employee.designation,
    role: employee.role,
    loginProvider: employee.loginProvider,
    isEmailVerified: employee.isEmailVerified,
    lastLogin: employee.lastLogin,
    isActive: employee.isActive,
    departmentId: employee.departmentId,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  };
}