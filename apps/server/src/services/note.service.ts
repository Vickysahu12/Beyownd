import { NoteRepository } from "../repositories/note.repository";
import { ApiError } from "../utils/ApiError";

export class NoteService {
  static async createNote(userId: string, data: { title: string; content?: string }) {
    if (!data.title || data.title.trim().length === 0) {
      throw new ApiError(400, "Note title is required");
    }
    return await NoteRepository.createNote({ userId, ...data });
  }

  static async getUserNotes(userId: string) {
    return await NoteRepository.getUserNotes(userId);
  }

  static async updateNote(noteId: string, userId: string, data: { title?: string; content?: string }) {
    const note = await NoteRepository.getNoteById(noteId, userId);
    if (!note) throw new ApiError(404, "Note not found");

    return await NoteRepository.updateNote(noteId, userId, data);
  }

  static async deleteNote(noteId: string, userId: string) {
    const note = await NoteRepository.getNoteById(noteId, userId);
    if (!note) throw new ApiError(404, "Note not found");

    return await NoteRepository.deleteNote(noteId, userId);
  }

  static async getNoteById(noteId: string, userId: string) {
  const note = await NoteRepository.getNoteById(noteId, userId);
  if (!note) throw new ApiError(404, "Note not found");
  return note;
}

static async updateProgress(noteId: string, userId: string, progress: number) {
  if (progress < 0 || progress > 100) {
    throw new ApiError(400, "Progress must be between 0 and 100");
  }
  const note = await NoteRepository.getNoteById(noteId, userId);
  if (!note) throw new ApiError(404, "Note not found");
  return NoteRepository.updateProgress(noteId, userId, progress);
}
}