import { Request, Response, NextFunction } from "express";
import { AdminRepository } from "../repositories/admin.repository";
import { ApiResponse } from "../utils/ApiResponse";

export class AdminController {
  static async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await AdminRepository.getAllStudents();
      res.status(200).json(new ApiResponse(200, students, "Students fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await AdminRepository.getStudentById(String(req.params.id));
      if (!student) {
        return res.status(404).json(new ApiResponse(404, null, "Student not found"));
      }
      res.status(200).json(new ApiResponse(200, student, "Student fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await AdminRepository.getAnalytics();
      res.status(200).json(new ApiResponse(200, analytics, "Analytics fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminRepository.broadcastTask(req.body);
      res.status(201).json(new ApiResponse(201, result, `Task assigned to ${result.length} students`));
    } catch (error) {
      next(error);
    }
  }

  static async createNote(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminRepository.broadcastNote(req.body);
      res.status(201).json(new ApiResponse(201, result, `Note assigned to ${result.length} students`));
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminRepository.deleteTaskEverywhere(String(req.params.id));
      res.status(200).json(new ApiResponse(200, null, "Task deleted for all students"));
    } catch (error) {
      next(error);
    }
  }

  static async deleteNote(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminRepository.deleteNoteEverywhere(String(req.params.id));
      res.status(200).json(new ApiResponse(200, null, "Note deleted for all students"));
    } catch (error) {
      next(error);
    }
  }
}