import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      data: null,
    });
  }

  // Unexpected/unknown errors — log karo but user ko generic message do
  console.error("Unhandled error:", err);

  return res.status(500).json({
    statusCode: 500,
    success: false,
    message: "Something went wrong. Please try again.",
    data: null,
  });
}