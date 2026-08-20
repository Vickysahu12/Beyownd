import { Request, Response, NextFunction } from "express";
import { HomeService } from "../services/home.service";
import { ApiResponse } from "../utils/ApiResponse";

export class HomeController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const result = await HomeService.getDashboard(userId);
      res.status(200).json(new ApiResponse(200, result, "Dashboard fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}