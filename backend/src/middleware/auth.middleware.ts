import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/apiError.js";
import { AUTH_COOKIES } from "../auth/constants.js";
import { verifyAccessToken } from "../auth/tokens/verifyAccessToken.js";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[AUTH_COOKIES.ACCESS_TOKEN];

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  const decoded = verifyAccessToken(token);

  req.user = decoded;

  next();
}

// Temporary backward compatibility
export const verifyJWT = authenticate;