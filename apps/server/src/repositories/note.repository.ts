import { db } from "../config/db";
import { notes } from "../db/schema/notes.schema";
import { eq, and } from "drizzle-orm";

export class NoteRepository {
  static async createNote(data: { userId: string; title: string; content?: string; track?: string; icon?: string  }) {
    const result = await db.insert(notes).values(data).returning();
    return result[0];
  }

  static async getUserNotes(userId: string) {
    return await db.select().from(notes).where(eq(notes.userId, userId));
  }

  static async getNoteById(noteId: string, userId: string) {
  const result = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  return result[0] || null;
}

  static async updateNote(noteId: string, userId: string, data: Partial<{ title: string; content: string }>) {
    const result = await db
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .returning();
    return result[0];
  }

  static async deleteNote(noteId: string, userId: string) {
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .returning();
    return result[0];
  }

static async updateProgress(noteId: string, userId: string, progress: number) {
  const result = await db
    .update(notes)
    .set({ progress, updatedAt: new Date() })
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .returning();
  return result[0];
}
}