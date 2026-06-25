import { Request, Response } from "express";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(501).json({
    success: false,
    message: "Register API not implemented yet",
  });
};