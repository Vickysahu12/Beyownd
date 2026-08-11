import { Request, Response, NextFunction } from "express";
import { NoteService } from "../services/note.service";
import { ApiResponse } from "../utils/ApiResponse";

export class NoteController {
  static async createNote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const note = await NoteService.createNote(userId, req.body);
      res.status(201).json(new ApiResponse(201, note, "Note created successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const notes = await NoteService.getUserNotes(userId);
      res.status(200).json(new ApiResponse(200, notes, "Notes fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updateNote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const id = req.params.id as string;
      const updatedNote = await NoteService.updateNote(id, userId, req.body);
      res.status(200).json(new ApiResponse(200, updatedNote, "Note updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async deleteNote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const id = req.params.id as string;
      await NoteService.deleteNote(id, userId);
      res.status(200).json(new ApiResponse(200, null, "Note deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}