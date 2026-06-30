import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString(),
    });

    return;
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
}