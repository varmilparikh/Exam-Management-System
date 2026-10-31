import type { Request, Response } from "express";
import { ExamOptInStatus, Role } from "../generated/prisma/client.js";
import examOptInService from "../services/examOptIn.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { listExamOptInsQuerySchema } from "../validators/examOptIn.validator.js";

export const getUpcomingExamOptIns = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== Role.FACULTY) throw new ApiError(403, "Faculty access required.");
  const data = await examOptInService.getUpcomingForFaculty(req.user.id);
  res.status(200).json(new ApiResponse(200, data, "Upcoming exam sessions fetched successfully"));
});

export const createExamOptIn = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== Role.FACULTY) throw new ApiError(403, "Faculty access required.");
  const { examId } = req.body as { examId: string };
  const data = await examOptInService.request(req.user.id, examId);
  res.status(201).json(new ApiResponse(201, data, "Opt-in submitted for review"));
});

export const cancelExamOptIn = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  if (req.user?.role !== Role.FACULTY) throw new ApiError(403, "Faculty access required.");
  const data = await examOptInService.cancel(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, data, "Opt-in cancelled successfully"));
});

export const getExamOptIns = asyncHandler(async (req: Request, res: Response) => {
  const filters = listExamOptInsQuerySchema.parse(req.query);
  const data = await examOptInService.list({
    ...filters,
    status: filters.status as ExamOptInStatus | undefined,
    role: req.user!.role,
    employeeId: req.user!.id,
  });
  res.status(200).json(new ApiResponse(200, data, "Exam opt-ins fetched successfully"));
});

export const confirmExamOptIn = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  if (req.user?.role !== Role.SUPER_ADMIN && req.user?.role !== Role.COE) {
    throw new ApiError(403, "Only higher authorities can review opt-ins.");
  }
  const { remark } = (req.body ?? {}) as { remark?: string };
  const data = await examOptInService.review(req.params.id, req.user.id, "CONFIRM", remark);
  res.status(200).json(new ApiResponse(200, data, "Faculty participation confirmed"));
});

export const rejectExamOptIn = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  if (req.user?.role !== Role.SUPER_ADMIN && req.user?.role !== Role.COE) {
    throw new ApiError(403, "Only higher authorities can review opt-ins.");
  }
  const { remark } = req.body as { remark: string };
  const data = await examOptInService.review(req.params.id, req.user.id, "REJECT", remark);
  res.status(200).json(new ApiResponse(200, data, "Faculty opt-in rejected"));
});
