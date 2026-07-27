import type { Request, Response } from "express";

import employeeService from "../services/employee.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

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
  async (
    req: CreateEmployeeRequest,
    res: Response,
  ): Promise<void> => {
    const employee = await employeeService.create(req.body);

    res.status(201).json(
      new ApiResponse(
        201,
        employee,
        "Employee created successfully",
      ),
    );
  },
);

/**
 * Get All Employees
 */
export const getEmployees = asyncHandler(
  async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const employees = await employeeService.getAll();

    res.status(200).json(
      new ApiResponse(
        200,
        employees,
        "Employees fetched successfully",
      ),
    );
  },
);

/**
 * Get Employee By ID
 */
export const getEmployeeById = asyncHandler(
  async (
    req: EmployeeIdRequest,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;

    const employee = await employeeService.getById(id);

    res.status(200).json(
      new ApiResponse(
        200,
        employee,
        "Employee fetched successfully",
      ),
    );
  },
);

/**
 * Update Employee
 */
export const updateEmployee = asyncHandler(
  async (
    req: UpdateEmployeeRequest,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;

    const employee = await employeeService.update(
      id,
      req.body,
    );

    res.status(200).json(
      new ApiResponse(
        200,
        employee,
        "Employee updated successfully",
      ),
    );
  },
);

/**
 * Delete Employee
 */
export const deleteEmployee = asyncHandler(
  async (
    req: EmployeeIdRequest,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;

    await employeeService.delete(id);

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Employee deleted successfully",
      ),
    );
  },
);