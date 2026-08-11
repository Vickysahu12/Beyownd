import { pgTable, uuid, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  theme: varchar("theme", { length: 20 }).default("system").notNull(), // 'light' | 'dark' | 'system'
  emailAlerts: boolean("email_alerts").default(true).notNull(),
  pushNotifications: boolean("push_notifications").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});