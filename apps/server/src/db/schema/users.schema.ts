import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 20 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),

  // OTP Verification Fields
  isVerified: boolean("is_verified").default(false).notNull(),
  otp: varchar("otp", { length: 6 }),
  otpExpiresAt: timestamp("otp_expires_at"),

  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  hasCompletedProfileSetup: boolean("has_completed_profile_setup").default(false),
  hasCompletedWorkspaceSetup: boolean("has_completed_workspace_setup").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});