import { Request, Response, NextFunction } from "express";
import { PreferenceService } from "../services/preference.service";
import { ApiResponse } from "../utils/ApiResponse";

export class PreferenceController {
  static async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const pref = await PreferenceService.getPreferences(userId);
      res.status(200).json(new ApiResponse(200, pref, "Preferences fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const updated = await PreferenceService.updatePreferences(userId, req.body);
      res.status(200).json(new ApiResponse(200, updated, "Preferences updated successfully"));
    } catch (error) {
      next(error);
    }
  }
}