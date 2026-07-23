import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/apiError.js";
import { verifyToken } from "../utils/verifyToken.js";

export function verifyJWT(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization header is missing or invalid");
  }

  const token = authHeader.substring(7);

  const decoded = verifyToken(token);

  req.user = decoded;

  next();
}
