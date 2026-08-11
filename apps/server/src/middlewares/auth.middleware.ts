import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || (req.headers as any).Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Access token missing or malformed");
    }

    // Extract raw token
    const token = authHeader.split(" ")[1]?.trim();

    if (!token) {
      throw new ApiError(401, "Token not provided");
    }

    const payload = verifyAccessToken(token);
    (req as any).user = payload;

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired access token"));
  }
};