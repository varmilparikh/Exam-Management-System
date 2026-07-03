import bcrypt from "bcryptjs";

import employeeRepository from "../repositories/employee.repository.js";
import departmentRepository from "../repositories/department.repository.js";

import { ApiError } from "../utils/apiError.js";

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
    const existingEmail = await employeeRepository.findAuthByEmail(data.email);

    if (existingEmail) {
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
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return employeeRepository.create({
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

    if (data.departmentId) {
      const department = await departmentRepository.findById(data.departmentId);

      if (!department) {
        throw new ApiError(404, "Department not found");
      }
    }

    return employeeRepository.update(id, {
      ...data,
      department: data.departmentId
        ? {
            connect: {
              id: data.departmentId,
            },
          }
        : undefined,
    });
  }

  /**
   * Soft Delete Employee
   */
  async delete(id: string): Promise<EmployeeResponse> {
    const employee = await employeeRepository.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    return employeeRepository.softDelete(id);
  }
}

export default new EmployeeService();
