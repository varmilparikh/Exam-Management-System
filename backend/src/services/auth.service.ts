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
import { isRefreshTokenVersionCurrent } from "../auth/tokens/refreshTokenVersion.js";
import { toEmployeeResponse } from "../mappers/employee.mapper.js";

const dummyPasswordHash = bcrypt.hash(
  "invalid-login-placeholder",
  env.bcryptSaltRounds,
);

class AuthService {
  async register(
    data: RegisterUserDto,
    createdById: string,
  ): Promise<EmployeeResponseDto> {
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
      role: data.role,
      phone: data.phone,

      department: {
        connect: {
          id: data.departmentId,
        },
      },
    });

    try {
      await activityLogService.log({
        employeeId: createdById,
        action: ActivityAction.CREATE_EMPLOYEE,
        description: `${employee.name} was created by an administrator`,
        entityType: EntityType.EMPLOYEE,
        entityId: employee.id,
      });
    } catch (error) {
      console.error("Failed to create employee log", error);
    }

    // Remove sensitive information
    return toEmployeeResponse(employee);
  }

  async login(data: LoginUserDto): Promise<LoginResult> {
    // Find employee
    const employee = await authRepository.findByEmail(data.email);

    const fallbackPasswordHash = await dummyPasswordHash;
    const passwordHash = employee?.password ?? fallbackPasswordHash;
    const isPasswordValid = await bcrypt.compare(data.password, passwordHash);

    if (!employee?.password || !isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!employee.isActive) {
      throw new ApiError(
        403,
        "This account is inactive. Contact an administrator.",
      );
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
      refreshTokenVersion: employee.refreshTokenVersion,
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
    await authRepository.incrementRefreshTokenVersion(user.id);

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

    if (
      !isRefreshTokenVersionCurrent(
        payload.refreshTokenVersion,
        employee.refreshTokenVersion,
      )
    ) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    return generateAccessToken({
      id: employee.id,
      email: employee.email,
      role: employee.role,
      refreshTokenVersion: employee.refreshTokenVersion,
    });
  }
}

export default new AuthService();
