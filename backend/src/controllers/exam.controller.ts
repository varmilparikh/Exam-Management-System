import type { Request, Response } from "express";

import examService from "../services/exam.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

import type { CreateExamDto, UpdateExamDto } from "../types/exam.types.js";

/**
 * Create Exam
 */
export const createExam = asyncHandler(
  async (
    req: Request<Record<string, never>, unknown, CreateExamDto>,
    res: Response,
  ): Promise<void> => {
    const exam = await examService.create(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, exam, "Exam created successfully"));
  },
);

/**
 * Get All Exams
 */
export const getExams = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const exams = await examService.getAll();

    res
      .status(200)
      .json(new ApiResponse(200, exams, "Exams fetched successfully"));
  },
);

/**
 * Get Exam By ID
 */
export const getExamById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    const exam = await examService.getById(id);

    res
      .status(200)
      .json(new ApiResponse(200, exam, "Exam fetched successfully"));
  },
);

/**
 * Update Exam
 */
export const updateExam = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, UpdateExamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;

    const exam = await examService.update(id, req.body);

    res
      .status(200)
      .json(new ApiResponse(200, exam, "Exam updated successfully"));
  },
);

/**
 * Delete Exam
 */
export const deleteExam = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    await examService.delete(id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Exam deleted successfully"));
  },
);
