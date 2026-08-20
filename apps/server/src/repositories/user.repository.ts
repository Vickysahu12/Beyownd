import { db } from "../config/db";
import { users } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export class UserRepository {
  static async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  static async findById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  static async findByReferralCode(code: string) {
    const result = await db.select().from(users).where(eq(users.referralCode, code)).limit(1);
    return result[0] || null;
  }

  static async countReferrals(userId: string) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.referredBy, userId));
    return Number(result[0]?.count || 0);
  }

  static async createUser(data: {
    email: string;
    passwordHash: string;
    name?: string;
    otp?: string;
    otpExpiresAt?: Date;
    referralCode?: string;
    referredBy?: string;
  }) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }

  static async updateOtp(id: string, otp: string, otpExpiresAt: Date) {
    await db.update(users).set({ otp, otpExpiresAt }).where(eq(users.id, id));
  }

  static async markAsVerified(id: string) {
    await db.update(users).set({ isVerified: true, otp: null, otpExpiresAt: null }).where(eq(users.id, id));
  }

  static async saveProfileAnswers(
    id: string,
    answers: {
      currentYear: string;
      techInterest: string;
      experienceLevel: string;
      weeklyTimeAvailable: string;
      primaryGoal?: string;
    }
  ) {
    const result = await db
      .update(users)
      .set({ ...answers, hasCompletedProfileSetup: true })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  static async updateFlags(
    id: string,
    flags: Partial<{
      hasCompletedOnboarding: boolean;
      hasCompletedProfileSetup: boolean;
      hasCompletedWorkspaceSetup: boolean;
    }>
  ) {
    const result = await db.update(users).set(flags).where(eq(users.id, id)).returning();
    return result[0];
  }
}