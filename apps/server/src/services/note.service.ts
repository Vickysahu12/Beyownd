import { NoteRepository } from "../repositories/note.repository";
import { ApiError } from "../utils/ApiError";

export class NoteService {
  static async createNote(adminUserId: string, data: { title: string; content?: string; track?: string; icon?: string }) {
    if (!data.title || data.title.trim().length === 0) {
      throw new ApiError(400, "Note title is required");
    }
    return await NoteRepository.createNote({ ...data, createdBy: adminUserId });
  }

  static async getAllNotesForUser(userId: string) {
    const [allNotes, progressRows] = await Promise.all([
      NoteRepository.getAllNotes(),
      NoteRepository.getProgressForUser(userId),
    ]);
    const progressMap = new Map(progressRows.map((p) => [p.noteId, p.progress]));
    return allNotes.map((n) => ({ ...n, progress: progressMap.get(n.id) || 0 }));
  }

  static async getNoteById(noteId: string, userId: string) {
    const note = await NoteRepository.getNoteById(noteId);
    if (!note) throw new ApiError(404, "Note not found");
    const progressRow = await NoteRepository.getProgressForNote(noteId, userId);
    return { ...note, progress: progressRow?.progress || 0 };
  }

  static async updateNote(noteId: string, data: { title?: string; content?: string; track?: string; icon?: string }) {
    const note = await NoteRepository.getNoteById(noteId);
    if (!note) throw new ApiError(404, "Note not found");
    return await NoteRepository.updateNote(noteId, data);
  }

  static async deleteNote(noteId: string) {
    const note = await NoteRepository.getNoteById(noteId);
    if (!note) throw new ApiError(404, "Note not found");
    return await NoteRepository.deleteNote(noteId);
  }

  static async updateProgress(noteId: string, userId: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new ApiError(400, "Progress must be between 0 and 100");
    }
    const note = await NoteRepository.getNoteById(noteId);
    if (!note) throw new ApiError(404, "Note not found");
    return NoteRepository.upsertProgress(noteId, userId, progress);
  }
}