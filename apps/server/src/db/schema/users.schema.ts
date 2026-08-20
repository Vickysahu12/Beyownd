import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 20 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),

  isVerified: boolean("is_verified").default(false).notNull(),
  otp: varchar("otp", { length: 6 }),
  otpExpiresAt: timestamp("otp_expires_at"),

  currentYear: varchar("current_year", { length: 50 }),
  techInterest: varchar("tech_interest", { length: 50 }),
  experienceLevel: varchar("experience_level", { length: 50 }),
  weeklyTimeAvailable: varchar("weekly_time_available", { length: 20 }),
  primaryGoal: varchar("primary_goal", { length: 100 }),

  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  hasCompletedProfileSetup: boolean("has_completed_profile_setup").default(false),
  hasCompletedWorkspaceSetup: boolean("has_completed_workspace_setup").default(false),

  // Referral system
  referralCode: varchar("referral_code", { length: 12 }).unique(),
  referredBy: uuid("referred_by"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});