import type { Request, Response } from "express";

import employeeService from "../services/employee.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import type { EmployeeFilters } from "../types/employeeFilter.types.js";

import type {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types/employee.types.js";

type CreateEmployeeRequest = Request<
  Record<string, never>,
  unknown,
  CreateEmployeeDto
>;

type UpdateEmployeeRequest = Request<
  { id: string },
  unknown,
  UpdateEmployeeDto
>;

type EmployeeIdRequest = Request<{ id: string }>;

/**
 * Create Employee
 */
export const createEmployee = asyncHandler(
  async (req: CreateEmployeeRequest, res: Response): Promise<void> => {
    const employee = await employeeService.create(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, employee, "Employee created successfully"));
  },
);

/**
 * Get All Employees
 */
export const getEmployees = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const filters: EmployeeFilters = {
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,

      departmentId:
        typeof req.query.departmentId === "string"
          ? req.query.departmentId
          : undefined,

      role:
        typeof req.query.role === "string"
          ? (req.query.role as EmployeeFilters["role"])
          : undefined,

      status:
        req.query.status === "ACTIVE" || req.query.status === "INACTIVE"
          ? req.query.status
          : undefined,
    };

    const employees = await employeeService.getAll(filters);

    res
      .status(200)
      .json(new ApiResponse(200, employees, "Employees fetched successfully"));
  },
);

/**
 * Get Employee By ID
 */
export const getEmployeeById = asyncHandler(
  async (req: EmployeeIdRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const employee = await employeeService.getById(id);

    res
      .status(200)
      .json(new ApiResponse(200, employee, "Employee fetched successfully"));
  },
);

/**
 * Update Employee
 */
export const updateEmployee = asyncHandler(
  async (req: UpdateEmployeeRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const employee = await employeeService.update(id, req.body);

    res
      .status(200)
      .json(new ApiResponse(200, employee, "Employee updated successfully"));
  },
);

/**
 * Delete Employee
 */
export const deleteEmployee = asyncHandler(
  async (req: EmployeeIdRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    await employeeService.delete(id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Employee deleted successfully"));
  },
);
