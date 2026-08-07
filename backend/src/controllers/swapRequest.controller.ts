import type { Request, Response } from "express";

import swapRequestService from "../services/swapRequest.service.js";

import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import type {
  CreateSwapRequestDto,
  ApproveSwapRequestDto,
  RejectSwapRequestDto,
  CancelSwapRequestDto,
  RejectSwapByCoeDto,
} from "../types/swapRequest.types.js";

import type { SwapRequestFilters } from "../types/swapRequestFilter.types.js";

/**
 * Get Swap Requests
 */
export const getSwapRequests = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filters: SwapRequestFilters = {
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,

      status:
        typeof req.query.status === "string" ? req.query.status : undefined,
    };

    const swapRequests = await swapRequestService.getRequests(
      req.user,
      page,
      limit,
      filters,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          swapRequests,
          "Swap requests fetched successfully",
        ),
      );
  },
);

/**
 * Create Swap Request
 */
export const createSwapRequest = asyncHandler(
  async (
    req: Request<Record<string, never>, unknown, CreateSwapRequestDto>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const swapRequest = await swapRequestService.requestSwap(
      employeeId,
      req.body,
    );

    res
      .status(201)
      .json(
        new ApiResponse(201, swapRequest, "Swap request created successfully"),
      );
  },
);

/**
 * Accept Swap Request
 */
export const acceptSwapRequest = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const swapRequest = await swapRequestService.acceptSwap(id, employeeId);

    res
      .status(200)
      .json(
        new ApiResponse(200, swapRequest, "Swap request accepted successfully"),
      );
  },
);

/**
 * Approve Swap Request
 */
export const approveSwapRequest = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, ApproveSwapRequestDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const swapRequest = await swapRequestService.approveSwap(
      id,
      employeeId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, swapRequest, "Swap request approved successfully"),
      );
  },
);

/**
 * Reject Swap Request
 */
export const rejectSwapRequest = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, RejectSwapRequestDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const swapRequest = await swapRequestService.rejectSwap(
      id,
      employeeId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, swapRequest, "Swap request rejected successfully"),
      );
  },
);

/**
 * Cancel Swap Request
 */
export const cancelSwapRequest = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, CancelSwapRequestDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const swapRequest = await swapRequestService.cancelSwap(
      id,
      employeeId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          swapRequest,
          "Swap request cancelled successfully",
        ),
      );
  },
);

/**
 * Reject Swap Request By COE
 */
export const rejectSwapByCoe = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, RejectSwapByCoeDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id: employeeId } = req.user;

    const swapRequest = await swapRequestService.rejectSwapByCoe(
      id,
      employeeId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, swapRequest, "Swap request rejected successfully"),
      );
  },
);
