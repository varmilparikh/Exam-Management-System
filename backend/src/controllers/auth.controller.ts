import type { Request, Response } from "express";
import type { z } from "zod";

import authService from "../services/auth.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { clearAuthCookies, setAuthCookies } from "../auth/cookies.js";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export async function register(
  req: Request<Record<string, never>, unknown, RegisterInput>,
  res: Response,
): Promise<void> {
  const employee = await authService.register(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, employee, "Employee registered successfully"));
}

export async function login(
  req: Request<Record<string, never>, unknown, LoginInput>,
  res: Response,
): Promise<void> {
  const result = await authService.login(req.body);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        employee: result.employee,
      },
      "Login successful",
    ),
  );
}

export function me(req: Request, res: Response): void {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
}

export async function logout(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  clearAuthCookies(res);

  await authService.logout(req.user);

  res.status(200).json(new ApiResponse(200, null, "Logout successful"));
}
