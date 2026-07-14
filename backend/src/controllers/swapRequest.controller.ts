import type { Request, Response } from "express";

import swapRequestService from "../services/swapRequest.service.js";

import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSwapRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const swapRequest = await swapRequestService.requestSwap(
      req.user!.id,
      req.body,
    );

    res
      .status(201)
      .json(
        new ApiResponse(201, swapRequest, "Swap request created successfully"),
      );
  },
);

export const acceptSwapRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const swapRequest = await swapRequestService.acceptSwap(
      req.params.id as string,
      req.user!.id,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, swapRequest, "Swap request accepted successfully"),
      );
  },
);

export const approveSwapRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const swapRequest = await swapRequestService.approveSwap(
      req.params.id as string,
      req.user!.id,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, swapRequest, "Swap request approved successfully"),
      );
  },
);

export const rejectSwapRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const swapRequest = await swapRequestService.rejectSwap(
      req.params.id as string,
      req.user!.id,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, swapRequest, "Swap request rejected successfully"),
      );
  },
);

export const cancelSwapRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const swapRequest = await swapRequestService.cancelSwap(
      req.params.id as string,
      req.user!.id,
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
