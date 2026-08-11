import { Request, Response, NextFunction } from "express";
import { WorkspaceService } from "../services/workspace.service";
import { ApiResponse } from "../utils/ApiResponse";

export class WorkspaceController {
  static async createWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { name } = req.body;

      const workspace = await WorkspaceService.createWorkspace(userId, name);
      res.status(201).json(new ApiResponse(201, workspace, "Workspace created successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getUserWorkspaces(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const workspaces = await WorkspaceService.getUserWorkspaces(userId);
      res.status(200).json(new ApiResponse(200, workspaces, "Workspaces fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}