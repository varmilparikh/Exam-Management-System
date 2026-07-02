import bcrypt from "bcryptjs";

import authRepository from "../repositories/auth.repository.js";

import { ApiError } from "../utils/apiError.js";

import type { RegisterUserDto } from "../types/auth.types.js";

import { generateToken } from "../utils/generateToken.js";
import type { LoginUserDto } from "../types/auth.types.js";
import { toEmployeeResponse } from "../mappers/employee.mapper.js";

class AuthService {
  async register(data: RegisterUserDto) {
    // Check email
    const existingEmail = await authRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new ApiError(409, "Email already exists");
    }

    // Check employee code
    const existingEmployee = await authRepository.findByEmployeeCode(
      data.employeeCode,
    );

    if (existingEmployee) {
      throw new ApiError(409, "Employee code already exists");
    }

    // Check department
    const department = await authRepository.findDepartmentById(
      data.departmentId,
    );

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create employee
    const employee = await authRepository.create({
      employeeCode: data.employeeCode,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      designation: data.designation,

      department: {
        connect: {
          id: data.departmentId,
        },
      },
    });

    // Remove sensitive information
    return toEmployeeResponse(employee);
  }

  async login(data: LoginUserDto) {
    // Find employee
    const employee = await authRepository.findByEmail(data.email);

    if (!employee) {
      throw new ApiError(401, "Invalid email or password");
    }

    // LOCAL login requires a password
    if (!employee.password) {
      throw new ApiError(401, "This account uses social login");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      data.password,
      employee.password,
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Update last login
    const updatedEmployee = await authRepository.updateLastLogin(employee.id);

    const token = generateToken({
      id: updatedEmployee.id,
      email: updatedEmployee.email,
      role: updatedEmployee.role,
    });

    return {
      employee: toEmployeeResponse(updatedEmployee),
      token,
    };
  }
}

export default new AuthService();
