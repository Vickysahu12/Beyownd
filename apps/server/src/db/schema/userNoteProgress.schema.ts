import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { notes } from "./notes.schema";

export const userNoteProgress = pgTable("user_note_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  noteId: uuid("note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  progress: integer("progress").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});