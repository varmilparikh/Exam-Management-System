import type { Request, Response } from "express";

import swapRequestService from "../services/swapRequest.service.js";

import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSwapRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const swapRequest =
      await swapRequestService.requestSwap(
        req.user!.id,
        req.body,
      );

    res.status(201).json(
      new ApiResponse(
        201,
        swapRequest,
        "Swap request created successfully",
      ),
    );
  },
);