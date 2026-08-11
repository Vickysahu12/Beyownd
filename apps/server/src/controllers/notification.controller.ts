import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";
import { ApiResponse } from "../utils/ApiResponse";

export class NotificationController {
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const data = await NotificationService.getNotifications(userId);
      res.status(200).json(new ApiResponse(200, data, "Notifications fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const id = req.params.id as string;
      const updated = await NotificationService.markAsRead(id, userId);
      res.status(200).json(new ApiResponse(200, updated, "Marked as read"));
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      await NotificationService.markAllAsRead(userId);
      res.status(200).json(new ApiResponse(200, null, "All notifications marked as read"));
    } catch (error) {
      next(error);
    }
  }
}