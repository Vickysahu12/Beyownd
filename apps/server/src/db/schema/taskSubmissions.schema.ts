import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { tasks } from "./tasks.schema";

export const submissionTypeEnum = pgEnum("submission_type", ["link", "text", "file"]);

export const taskSubmissions = pgTable("task_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  submissionType: submissionTypeEnum("submission_type").default("link").notNull(),
  submissionUrl: text("submission_url"),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});