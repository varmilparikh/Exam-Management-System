import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Validation failed",
      errors: err.issues,
    });
  }

  // Log unexpected errors
  if (process.env.NODE_ENV !== "test") {
    console.error({
      method: req.method,
      path: req.originalUrl,
      error: err,
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  });
};