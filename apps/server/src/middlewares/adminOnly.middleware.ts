import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// Abhi ke liye simplest approach — apna khud ka email .env mein rakho,
// jab tak proper role-based system (users.role column) nahi banta.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  const userEmail = (req as any).user?.email;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    throw new ApiError(403, "Admin access required");
  }
  next();
}