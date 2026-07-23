import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { ApiError } from "./apiError.js";
import type { JwtPayload } from "./generateToken.js";

export function verifyToken(token: string): JwtPayload {
  const secret = env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & {
      iat?: number;
      exp?: number;
    };

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}
