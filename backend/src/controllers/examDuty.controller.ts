import type { Request, Response } from "express";

import examDutyService from "../services/examDuty.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

import type {
  CreateExamDutyDto,
  UpdateExamDutyDto,
} from "../types/examDuty.types.js";

import { DutyStatus } from "../generated/prisma/client.js";

import { ApiError } from "../utils/apiError.js";
/**
 * Create Exam Duty
 */
export const createExamDuty = asyncHandler(
  async (
    req: Request<Record<string, never>, unknown, CreateExamDutyDto>,
    res: Response,
  ): Promise<void> => {
    const examDuty = await examDutyService.create(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, examDuty, "Exam duty assigned successfully"));
  },
);

/**
 * Get All Exam Duties
 */
export const getExamDuties = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filters = {
      examId: req.query.examId as string | undefined,
      employeeId: req.query.employeeId as string | undefined,
      status: req.query.status as DutyStatus | undefined,

      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
    };

    const examDuties = await examDutyService.getAll(page, limit, filters);

    res
      .status(200)
      .json(
        new ApiResponse(200, examDuties, "Exam duties fetched successfully"),
      );
  },
);

export const getEmployeeDuties = asyncHandler(
  async (
    req: Request<{ employeeId: string }>,
    res: Response,
  ): Promise<void> => {
    const duties = await examDutyService.getByEmployee(req.params.employeeId);

    res
      .status(200)
      .json(
        new ApiResponse(200, duties, "Employee duties fetched successfully"),
      );
  },
);

export const getMyUpcomingDuties = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const duties = await examDutyService.getUpcomingByEmployee(req.user.id);

    res
      .status(200)
      .json(
        new ApiResponse(200, duties, "My upcoming duties fetched successfully"),
      );
  },
);

export const getMyDuties = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const duties = await examDutyService.getByEmployee(req.user.id);

    res
      .status(200)
      .json(new ApiResponse(200, duties, "My duties fetched successfully"));
  },
);

export const getExamDutiesByExam = asyncHandler(
  async (req: Request<{ examId: string }>, res: Response): Promise<void> => {
    const duties = await examDutyService.getByExam(req.params.examId);

    res
      .status(200)
      .json(new ApiResponse(200, duties, "Exam duties fetched successfully"));
  },
);

/**
 * Get Exam Duty By ID
 */
export const getExamDutyById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    const examDuty = await examDutyService.getById(id);

    res
      .status(200)
      .json(new ApiResponse(200, examDuty, "Exam duty fetched successfully"));
  },
);

/**
 * Update Exam Duty
 */
export const updateExamDuty = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, UpdateExamDutyDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;

    const examDuty = await examDutyService.update(id, req.body);

    res
      .status(200)
      .json(new ApiResponse(200, examDuty, "Exam duty updated successfully"));
  },
);

/**
 * Delete Exam Duty
 */
export const deleteExamDuty = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    await examDutyService.delete(id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Exam duty deleted successfully"));
  },
);
