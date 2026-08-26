import { db } from "../config/db";
import { notes } from "../db/schema/notes.schema";
import { userNoteProgress } from "../db/schema/userNoteProgress.schema";
import { eq, and } from "drizzle-orm";

export class NoteRepository {
  static async createNote(data: { title: string; content?: string; track?: string; icon?: string; createdBy?: string }) {
    const result = await db.insert(notes).values(data).returning();
    return result[0];
  }

  static async getAllNotes() {
    return await db.select().from(notes);
  }

  static async getNoteById(noteId: string) {
    const result = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1);
    return result[0] || null;
  }

  static async updateNote(noteId: string, data: Partial<{ title: string; content: string; track: string; icon: string }>) {
    const result = await db
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(notes.id, noteId))
      .returning();
    return result[0];
  }

  static async deleteNote(noteId: string) {
    const result = await db.delete(notes).where(eq(notes.id, noteId)).returning();
    return result[0];
  }

  static async getProgressForUser(userId: string) {
    return db.select().from(userNoteProgress).where(eq(userNoteProgress.userId, userId));
  }

  static async getProgressForNote(noteId: string, userId: string) {
    const result = await db
      .select()
      .from(userNoteProgress)
      .where(and(eq(userNoteProgress.noteId, noteId), eq(userNoteProgress.userId, userId)))
      .limit(1);
    return result[0] || null;
  }

  static async upsertProgress(noteId: string, userId: string, progress: number) {
    const existing = await this.getProgressForNote(noteId, userId);
    if (existing) {
      const result = await db
        .update(userNoteProgress)
        .set({ progress, updatedAt: new Date() })
        .where(eq(userNoteProgress.id, existing.id))
        .returning();
      return result[0];
    }
    const result = await db.insert(userNoteProgress).values({ userId, noteId, progress }).returning();
    return result[0];
  }
}