import type { Request, Response } from "express";

import employeeService from "../services/employee.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Create Employee
 */
export const createEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const employee = await employeeService.create(req.body);

    res.status(201).json(
      new ApiResponse(
        201,
        employee,
        "Employee created successfully"
      )
    );
  }
);

/**
 * Get All Employees
 */
export const getEmployees = asyncHandler(
  async (_req: Request, res: Response) => {
    const employees = await employeeService.getAll();

    res.status(200).json(
      new ApiResponse(
        200,
        employees,
        "Employees fetched successfully"
      )
    );
  }
);

/**
 * Get Employee By ID
 */
export const getEmployeeById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const employee = await employeeService.getById(id);

    res.status(200).json(
      new ApiResponse(
        200,
        employee,
        "Employee fetched successfully"
      )
    );
  }
);

/**
 * Update Employee
 */
export const updateEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const employee = await employeeService.update(
      id,
      req.body
    );

    res.status(200).json(
      new ApiResponse(
        200,
        employee,
        "Employee updated successfully"
      )
    );
  }
);

/**
 * Delete Employee
 */
export const deleteEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await employeeService.delete(id);

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Employee deleted successfully"
      )
    );
  }
);