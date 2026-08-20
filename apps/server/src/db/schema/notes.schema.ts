import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  track: varchar("track", { length: 100 }),
  icon: varchar("icon", { length: 50 }),
  progress: integer("progress").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});