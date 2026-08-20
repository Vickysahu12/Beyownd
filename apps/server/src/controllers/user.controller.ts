import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      const { passwordHash, ...userWithoutPassword } = user;
      res.status(200).json(new ApiResponse(200, userWithoutPassword, "User profile fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async completeWorkspaceSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const updated = await UserRepository.updateFlags(userId, { hasCompletedWorkspaceSetup: true });
      const { passwordHash, otp, otpExpiresAt, ...safeUser } = updated;
      res.status(200).json(new ApiResponse(200, safeUser, "Workspace setup completed"));
    } catch (error) {
      next(error);
    }
  }

  static async getReferrals(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      const count = await UserRepository.countReferrals(userId);
      res.status(200).json(
        new ApiResponse(200, { referralCode: user.referralCode, referralCount: count }, "Referrals fetched successfully")
      );
    } catch (error) {
      next(error);
    }
  }
}