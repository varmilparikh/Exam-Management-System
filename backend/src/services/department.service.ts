import departmentRepository from "../repositories/department.repository.js";

import { ApiError } from "../utils/apiError.js";

import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "../types/department.types.js";

class DepartmentService {
  /**
   * Create Department
   */
  async create(data: CreateDepartmentDto) {
    const existingDepartment =
      await departmentRepository.findByName(data.name);

    if (existingDepartment) {
      throw new ApiError(
        409,
        "Department already exists"
      );
    }

    return departmentRepository.create({
      name: data.name,
    });
  }

  /**
   * Get All Departments
   */
  async getAll() {
    return departmentRepository.findAll();
  }

  /**
   * Get Department By ID
   */
  async getById(id: string) {
    const department =
      await departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(
        404,
        "Department not found"
      );
    }

    return department;
  }

  /**
   * Update Department
   */
  async update(
    id: string,
    data: UpdateDepartmentDto
  ) {
    const department =
      await departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(
        404,
        "Department not found"
      );
    }

    if (data.name) {
      const existingDepartment =
        await departmentRepository.findByName(
          data.name
        );

      if (
        existingDepartment &&
        existingDepartment.id !== id
      ) {
        throw new ApiError(
          409,
          "Department already exists"
        );
      }
    }

    return departmentRepository.update(id, data);
  }

  /**
   * Soft Delete Department
   */
  async delete(id: string) {
    const department =
      await departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(
        404,
        "Department not found"
      );
    }

    return departmentRepository.softDelete(id);
  }
}

export default new DepartmentService();