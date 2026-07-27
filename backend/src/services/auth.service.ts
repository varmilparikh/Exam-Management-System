import { env } from "../config/env.js";
import activityLogService from "./activityLog.service.js";

import { ActivityAction, EntityType } from "../generated/prisma/client.js";
import bcrypt from "bcryptjs";

import authRepository from "../repositories/auth.repository.js";

import { ApiError } from "../utils/apiError.js";

import type {
  LoginResult,
  RegisterUserDto,
  LoginUserDto,
} from "../types/auth.types.js";

import type { EmployeeResponseDto } from "../types/employee.types.js";

import type { JwtPayload } from "../types/jwt.types.js";
import { generateAccessToken } from "../auth/tokens/generateAccessToken.js";
import { generateRefreshToken } from "../auth/tokens/generateRefreshToken.js";
import { verifyRefreshToken } from "../auth/tokens/verifyRefreshToken.js";
import { toEmployeeResponse } from "../mappers/employee.mapper.js";

class AuthService {
  async register(data: RegisterUserDto): Promise<EmployeeResponseDto> {
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
    const hashedPassword = await bcrypt.hash(
      data.password,
      env.bcryptSaltRounds,
    );

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

  async login(data: LoginUserDto): Promise<LoginResult> {
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

    // Create activity log
    try {
      await activityLogService.log({
        employeeId: updatedEmployee.id,
        action: ActivityAction.LOGIN,
        description: `${updatedEmployee.name} logged in`,
        entityType: EntityType.EMPLOYEE,
        entityId: updatedEmployee.id,
      });
    } catch (error) {
      console.error("Failed to create login log", error);
    }

    const payload: JwtPayload = {
      id: updatedEmployee.id,
      email: updatedEmployee.email,
      role: updatedEmployee.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      employee: toEmployeeResponse(updatedEmployee),
      accessToken,
      refreshToken,
    };
  }

  async me(user: JwtPayload): Promise<EmployeeResponseDto> {
    const employee = await authRepository.findProfileById(user.id);

    if (!employee || !employee.isActive) {
      throw new ApiError(404, "Employee not found");
    }

    return toEmployeeResponse(employee);
  }

  async logout(user: JwtPayload): Promise<void> {
    try {
      await activityLogService.log({
        employeeId: user.id,
        action: ActivityAction.LOGOUT,
        description: `${user.email} logged out`,
        entityType: EntityType.EMPLOYEE,
        entityId: user.id,
      });
    } catch (error) {
      console.error("Failed to create logout log", error);
    }
  }

  async refresh(refreshToken: string): Promise<string> {
    const payload = verifyRefreshToken(refreshToken);

    const employee = await authRepository.findById(payload.id);

    if (!employee || !employee.isActive) {
      throw new ApiError(401, "Invalid refresh token");
    }

    return generateAccessToken({
      id: employee.id,
      email: employee.email,
      role: employee.role,
    });
  }
}

export default new AuthService();
