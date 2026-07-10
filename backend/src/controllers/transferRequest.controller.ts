import type { Request, Response } from "express";

import transferRequestService from "../services/transferRequest.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Create Transfer Request
 */
export const createTransferRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const transferRequest =
  await transferRequestService.requestTransfer(
    req.user!.id,
    req.body,
  );

    res.status(201).json(
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
  async (_req: Request, res: Response) => {
    const transferRequests =
      await transferRequestService.getAll();

    res.status(200).json(
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
  async (_req: Request, res: Response) => {
    const transferRequests =
      await transferRequestService.getPending();

    res.status(200).json(
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
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const transferRequest =
      await transferRequestService.getById(id);

    res.status(200).json(
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
  async (req: Request, res: Response) => {
    const transferRequests =
      await transferRequestService.getMyRequests(
        req.user!.id,
      );

    res.status(200).json(
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
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const transferRequest =
      await transferRequestService.approveTransfer(
        id,
        req.body,
      );

    res.status(200).json(
      new ApiResponse(
        200,
        transferRequest,
        "Transfer request approved successfully",
      ),
    );
  },
);