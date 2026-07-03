import type { Request, Response } from "express";

import departmentService from "../services/department.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Create Department
 */
export const createDepartment = asyncHandler(
  async (req: Request, res: Response) => {
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
  async (_req: Request, res: Response) => {
    const departments = await departmentService.getAll();

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
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

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
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
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
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await departmentService.delete(id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Department deleted successfully"));
  },
);
