import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { ApiError } from "../utils/apiError.js";
import { verifyToken } from "../utils/verifyToken.js";

export function verifyJWT(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(
      401,
      "Authorization header is missing"
    );
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "Invalid authorization header"
    );
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);

  req.user = decoded;

  next();
}