import type { Request, Response } from "express";

import departmentService from "../services/department.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "../types/department.types.js";

import type { DepartmentFilters } from "../types/departmentFilter.types.js";

/**
 * Create Department
 */
export const createDepartment = asyncHandler(
  async (
    req: Request<Record<string, never>, unknown, CreateDepartmentDto>,
    res: Response,
  ): Promise<void> => {
    const department = await departmentService.create(req.body);

    res
      .status(201)
      .json(
        new ApiResponse(201, department, "Department created successfully"),
      );
  },
);

/**
 * Get All Departments
 */
export const getDepartments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const filters: DepartmentFilters = {
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
    };

    const departments = await departmentService.getAll(filters);

    res
      .status(200)
      .json(
        new ApiResponse(200, departments, "Departments fetched successfully"),
      );
  },
);

/**
 * Get Department By ID
 */
export const getDepartmentById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    const department = await departmentService.getById(id);

    res
      .status(200)
      .json(
        new ApiResponse(200, department, "Department fetched successfully"),
      );
  },
);

/**
 * Update Department
 */
export const updateDepartment = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, UpdateDepartmentDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;

    const department = await departmentService.update(id, req.body);

    res
      .status(200)
      .json(
        new ApiResponse(200, department, "Department updated successfully"),
      );
  },
);

/**
 * Delete Department
 */
export const deleteDepartment = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    await departmentService.delete(id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Department deleted successfully"));
  },
);
