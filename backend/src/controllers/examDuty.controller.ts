import type { Request, Response } from "express";

import examDutyService from "../services/examDuty.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Create Exam Duty
 */
export const createExamDuty = asyncHandler(
  async (req: Request, res: Response) => {
    const examDuty = await examDutyService.create(req.body);

    res.status(201).json(
      new ApiResponse(
        201,
        examDuty,
        "Exam duty assigned successfully",
      ),
    );
  },
);

/**
 * Get All Exam Duties
 */
export const getExamDuties = asyncHandler(
  async (_req: Request, res: Response) => {
    const examDuties = await examDutyService.getAll();

    res.status(200).json(
      new ApiResponse(
        200,
        examDuties,
        "Exam duties fetched successfully",
      ),
    );
  },
);

/**
 * Get Exam Duty By ID
 */
export const getExamDutyById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const examDuty = await examDutyService.getById(id);

    res.status(200).json(
      new ApiResponse(
        200,
        examDuty,
        "Exam duty fetched successfully",
      ),
    );
  },
);

/**
 * Update Exam Duty
 */
export const updateExamDuty = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const examDuty = await examDutyService.update(
      id,
      req.body,
    );

    res.status(200).json(
      new ApiResponse(
        200,
        examDuty,
        "Exam duty updated successfully",
      ),
    );
  },
);

/**
 * Delete Exam Duty
 */
export const deleteExamDuty = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await examDutyService.delete(id);

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Exam duty deleted successfully",
      ),
    );
  },
);