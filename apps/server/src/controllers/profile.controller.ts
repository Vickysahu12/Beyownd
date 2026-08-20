import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services/profile.service";
import { ApiResponse } from "../utils/ApiResponse";

export class ProfileController {
  static async saveProfileAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { currentYear, techInterest, experienceLevel, weeklyTimeAvailable, primaryGoal } =
        req.body;

      const result = await ProfileService.saveProfileAnswers(userId, {
        currentYear,
        techInterest,
        experienceLevel,
        weeklyTimeAvailable,
        primaryGoal,
      });

      res.status(200).json(new ApiResponse(200, result, "Profile answers saved successfully"));
    } catch (error) {
      next(error);
    }
  }
}