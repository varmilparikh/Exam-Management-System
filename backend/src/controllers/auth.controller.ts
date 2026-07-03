import type {
  Request,
  Response,
} from "express";

import authService from "../services/auth.service.js";

import { ApiResponse } from "../utils/apiResponse.js";

export async function register(
  req: Request,
  res: Response
) {
  const employee = await authService.register(req.body);

  res.status(201).json(
    new ApiResponse(
      201,
      employee,
      "Employee registered successfully"
    )
  );
}

export async function login(
  req: Request,
  res: Response
) {
  const result = await authService.login(req.body);

  res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Login successful"
    )
  );
}

export async function me(
  req: Request,
  res: Response
) {
  res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetched successfully"
    )
  );
}