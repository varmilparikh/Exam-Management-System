import type { Request, Response } from "express";

import transferRequestService from "../services/transferRequest.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { ApiError } from "../utils/apiError.js";

import type {
  ApproveTransferRequestDto,
  CancelTransferRequestDto,
  CreateTransferRequestDto,
  RejectTransferRequestDto,
} from "../types/transferRequest.types.js";

/**
 * Create Transfer Request
 */
export const createTransferRequest = asyncHandler(
  async (
    req: Request<Record<string, never>, unknown, CreateTransferRequestDto>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const transferRequest = await transferRequestService.requestTransfer(
      employeeId,
      req.body,
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          transferRequest,
          "Transfer request created successfully",
        ),
      );
  },
);

/**
 * Get All Transfer Requests
 */
export const getTransferRequests = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const transferRequests = await transferRequestService.getAll();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transferRequests,
          "Transfer requests fetched successfully",
        ),
      );
  },
);

/**
 * Get Pending Transfer Requests
 */
export const getPendingTransferRequests = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const transferRequests = await transferRequestService.getPending();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transferRequests,
          "Pending transfer requests fetched successfully",
        ),
      );
  },
);

/**
 * Get Transfer Request By ID
 */
export const getTransferRequestById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId, role } = req.user;

    const transferRequest = await transferRequestService.getById(
      id,
      employeeId,
      role,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transferRequest,
          "Transfer request fetched successfully",
        ),
      );
  },
);

/**
 * Get My Transfer Requests
 */
export const getMyTransferRequests = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const transferRequests =
      await transferRequestService.getMyRequests(employeeId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transferRequests,
          "My transfer requests fetched successfully",
        ),
      );
  },
);

/**
 * Approve Transfer Request
 */
export const approveTransferRequest = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, ApproveTransferRequestDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const transferRequest = await transferRequestService.approveTransfer(
      id,
      employeeId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transferRequest,
          "Transfer request approved successfully",
        ),
      );
  },
);

/**
 * Reject Transfer Request
 */
export const rejectTransferRequest = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, RejectTransferRequestDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const transferRequest = await transferRequestService.rejectTransfer(
      id,
      employeeId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transferRequest,
          "Transfer request rejected successfully",
        ),
      );
  },
);

/**
 * Cancel Transfer Request
 */
export const cancelTransferRequest = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, CancelTransferRequestDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const transferRequest = await transferRequestService.cancelTransfer(
      id,
      employeeId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transferRequest,
          "Transfer request cancelled successfully",
        ),
      );
  },
);
