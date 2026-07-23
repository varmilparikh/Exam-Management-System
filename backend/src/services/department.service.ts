import departmentRepository from "../repositories/department.repository.js";
import type { DepartmentResponse } from "../constants/prismaSelect.js";
import { ApiError } from "../utils/apiError.js";

import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "../types/department.types.js";

class DepartmentService {
  /**
   * Create Department
   */
  async create(data: CreateDepartmentDto): Promise<DepartmentResponse> {
    const exists = await departmentRepository.existsByName(data.name);

    if (exists) {
      throw new ApiError(409, "Department already exists");
    }

    return departmentRepository.create({
      name: data.name,
    });
  }

  /**
   * Get All Departments
   */
  async getAll(): Promise<DepartmentResponse[]> {
    return departmentRepository.findAll();
  }

  /**
   * Get Department By ID
   */
  async getById(id: string): Promise<DepartmentResponse> {
    const department = await departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    return department;
  }

  /**
   * Update Department
   */
  async update(
    id: string,
    data: UpdateDepartmentDto,
  ): Promise<DepartmentResponse> {
    const department = await departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    if (data.name) {
      const existingDepartment = await departmentRepository.findByName(
        data.name,
      );

      if (existingDepartment && existingDepartment.id !== id) {
        throw new ApiError(409, "Department already exists");
      }
    }

    return departmentRepository.update(id, data);
  }

  /**
   * Soft Delete Department
   */
  async delete(id: string): Promise<DepartmentResponse> {
    const department = await departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const hasEmployees = await departmentRepository.hasEmployees(id);

    if (hasEmployees) {
      throw new ApiError(
        409,
        "Cannot delete department because employees are assigned to it.",
      );
    }

    return departmentRepository.softDelete(id);
  }
}

export default new DepartmentService();
