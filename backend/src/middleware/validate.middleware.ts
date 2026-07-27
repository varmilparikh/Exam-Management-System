import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req[target] = result.data;

    next();
  };
