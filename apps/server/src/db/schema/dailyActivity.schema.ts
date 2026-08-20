import { pgTable, uuid, date, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const dailyActivity = pgTable("daily_activity", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  activityDate: date("activity_date").notNull(),
  readinessSnapshot: integer("readiness_snapshot").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});