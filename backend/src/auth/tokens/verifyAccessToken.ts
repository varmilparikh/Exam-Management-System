import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";
import type { JwtPayload } from "../../types/jwt.types.js";

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }
}