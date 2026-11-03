import type { NextFunction, Request, Response } from "express";

import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/apiError.js";

type HttpError = Error & {
  status?: number;
  type?: string;
};

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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const knownErrors: Record<string, { status: number; message: string }> = {
      P2002: {
        status: 409,
        message: "A record with these details already exists",
      },
      P2003: {
        status: 409,
        message: "The operation conflicts with related records",
      },
      P2025: { status: 404, message: "The requested record was not found" },
    };
    const knownError = knownErrors[err.code];

    if (knownError) {
      return res.status(knownError.status).json({
        success: false,
        statusCode: knownError.status,
        message: knownError.message,
      });
    }
  }

  const httpError = err as HttpError;

  if (httpError.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Request body contains invalid JSON",
    });
  }

  if (httpError.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      statusCode: 413,
      message: "Request body is too large",
    });
  }

  // Log unexpected errors
  if (process.env.NODE_ENV !== "test") {
    console.error({
      method: req.method,
      path: req.path,
      error: { name: err.name, message: err.message },
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  });
};
