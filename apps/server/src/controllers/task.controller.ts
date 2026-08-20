import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { ApiResponse } from "../utils/ApiResponse";

export class TaskController {
  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const task = await TaskService.createTask(userId, req.body);
      res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const tasks = await TaskService.getUserTasks(userId);
      res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updateTaskStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const id = req.params.id as string; // Explicit string casting
      const { status } = req.body;

      const updatedTask = await TaskService.updateTaskStatus(id, userId, status);
      res.status(200).json(new ApiResponse(200, updatedTask, "Task status updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const id = req.params.id as string; // Explicit string casting

      await TaskService.deleteTask(id, userId);
      res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
  static async getTaskById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const result = await TaskService.getTaskById(id, userId);
    res.status(200).json(new ApiResponse(200, result, "Task fetched successfully"));
  } catch (error) {
    next(error);
  }
}

static async submitTask(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const { submissionType, submissionUrl, notes } = req.body;
    const result = await TaskService.submitTask(id, userId, { submissionType, submissionUrl, notes });
    res.status(200).json(new ApiResponse(200, result, "Task submitted successfully"));
  } catch (error) {
    next(error);
  }
}
}