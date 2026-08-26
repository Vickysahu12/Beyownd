import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const taskDifficultyEnum = pgEnum("task_difficulty", ["beginner", "intermediate", "advanced"]);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  difficulty: taskDifficultyEnum("difficulty").default("beginner").notNull(),
  estimatedHours: varchar("estimated_hours", { length: 20 }),
  dueDate: timestamp("due_date"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});