import { env } from "../config/env.js";

import bcrypt from "bcryptjs";

import activityLogService from "./activityLog.service.js";
import employeeRepository from "../repositories/employee.repository.js";
import departmentRepository from "../repositories/department.repository.js";

import { ApiError } from "../utils/apiError.js";

import { ActivityAction, EntityType } from "../generated/prisma/client.js";

import type {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types/employee.types.js";
import { EmployeeResponse } from "../constants/prismaSelect.js";

class EmployeeService {
  /**
   * Create Employee
   */
  async create(data: CreateEmployeeDto): Promise<EmployeeResponse> {
    // Check email
    const emailExists = await employeeRepository.existsByEmail(data.email);

    if (emailExists) {
      throw new ApiError(409, "Email already exists");
    }

    // Check employee code
    const existingCode = await employeeRepository.findByEmployeeCode(
      data.employeeCode,
    );

    if (existingCode) {
      throw new ApiError(409, "Employee code already exists");
    }

    // Check department
    const department = await departmentRepository.findById(data.departmentId);

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      data.password,
      env.bcryptSaltRounds,
    );

    const employee = await employeeRepository.create({
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

    // Activity log here

    try {
      await activityLogService.log({
        employeeId: employee.id,
        action: ActivityAction.CREATE_EMPLOYEE,
        description: `${employee.name} was created`,
        entityType: EntityType.EMPLOYEE,
        entityId: employee.id,
      });
    } catch (error) {
      console.error("Failed to create employee log", error);
    }

    return employee;
  }

  /**
   * Get All Employees
   */
  async getAll(): Promise<EmployeeResponse[]> {
    return employeeRepository.findAll();
  }

  /**
   * Get Employee By ID
   */
  async getById(id: string): Promise<EmployeeResponse> {
    const employee = await employeeRepository.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    return employee;
  }

  /**
   * Update Employee
   */
  async update(id: string, data: UpdateEmployeeDto): Promise<EmployeeResponse> {
    const employee = await employeeRepository.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    if (data.email) {
      const existingEmail = await employeeRepository.findByEmail(data.email);

      if (existingEmail && existingEmail.id !== id) {
        throw new ApiError(409, "Email already exists");
      }
    }

    if (data.employeeCode) {
      const existingEmployee = await employeeRepository.findByEmployeeCode(
        data.employeeCode,
      );

      if (existingEmployee && existingEmployee.id !== id) {
        throw new ApiError(409, "Employee code already exists");
      }
    }

    if (data.departmentId) {
      const department = await departmentRepository.findById(data.departmentId);

      if (!department) {
        throw new ApiError(404, "Department not found");
      }
    }

    const updatedEmployee = await employeeRepository.update(id, {
      ...data,
      department: data.departmentId
        ? {
            connect: {
              id: data.departmentId,
            },
          }
        : undefined,
    });

    try {
      await activityLogService.log({
        employeeId: updatedEmployee.id,
        action: ActivityAction.UPDATE_EMPLOYEE, // or your enum value
        description: `${updatedEmployee.name} was updated`,
        entityType: EntityType.EMPLOYEE,
        entityId: updatedEmployee.id,
      });
    } catch (error) {
      console.error("Failed to update employee log", error);
    }

    return updatedEmployee;
  }

  /**
   * Soft Delete Employee
   */
  async delete(id: string): Promise<EmployeeResponse> {
    const employee = await employeeRepository.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    if (employee.role === "SUPER_ADMIN") {
      throw new ApiError(409, "Cannot delete a SUPER_ADMIN");
    }

    const deletedEmployee = await employeeRepository.softDelete(id);

    try {
      await activityLogService.log({
        employeeId: deletedEmployee.id,
        action: ActivityAction.DELETE_EMPLOYEE, // or your enum value
        description: `${deletedEmployee.name} was deleted`,
        entityType: EntityType.EMPLOYEE,
        entityId: deletedEmployee.id,
      });
    } catch (error) {
      console.error("Failed to delete employee log", error);
    }

    return deletedEmployee;
  }
}

export default new EmployeeService();
