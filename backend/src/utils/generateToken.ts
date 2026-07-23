import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./apiError.js";
import type { Role } from "../generated/prisma/client.js";

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export const generateToken = (
  payload: JwtPayload,
): string => {
  if (!env.JWT_SECRET) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};