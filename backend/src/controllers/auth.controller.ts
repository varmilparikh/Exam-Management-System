import { Request, Response } from "express";

import authService from "../services/auth.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const employee = await authService.register(req.body);

    res.status(201).json(
      new ApiResponse(
        201,
        employee,
        "Employee registered successfully"
      )
    );
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Login successful"
      )
    );
  }
);

export const me = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json(
      new ApiResponse(
        200,
        req.user,
        "Current user fetched successfully"
      )
    );
  }
);