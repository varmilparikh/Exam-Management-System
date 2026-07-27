import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";
import type { JwtPayload } from "../../types/jwt.types.js";

export function generateAccessToken(payload: JwtPayload): string {
  if (!env.ACCESS_TOKEN_SECRET) {
    throw new ApiError(500, "ACCESS_TOKEN_SECRET is not configured");
  }

  const options: SignOptions = {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, options);
}