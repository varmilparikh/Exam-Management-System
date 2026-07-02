import jwt, { type SignOptions } from "jsonwebtoken";
import { ApiError } from "./apiError.js";
import type { Role } from "../generated/prisma/client.js";

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export const generateToken = (
  payload: JwtPayload
): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, secret, options);
};