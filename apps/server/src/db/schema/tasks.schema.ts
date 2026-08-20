import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const taskStatusEnum = pgEnum("task_status", ["pending", "in_progress", "completed"]);
export const taskDifficultyEnum = pgEnum("task_difficulty", ["beginner", "intermediate", "advanced"]);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  difficulty: taskDifficultyEnum("difficulty").default("beginner").notNull(),
  estimatedHours: varchar("estimated_hours", { length: 20 }),
  status: taskStatusEnum("status").default("pending").notNull(),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});