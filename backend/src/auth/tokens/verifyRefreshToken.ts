import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";
import type { JwtPayload } from "../../types/jwt.types.js";

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
}