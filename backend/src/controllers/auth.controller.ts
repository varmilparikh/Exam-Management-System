import { Request, Response } from "express";

import authService from "../services/auth.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const register = asyncHandler(
  async (req: Request, res: Response) => {

    const employee = await authService.register(req.body);

    return res.status(201).json(
      new ApiResponse(
        201,
        employee,
        "Employee registered successfully"
      )
    );
  }
);