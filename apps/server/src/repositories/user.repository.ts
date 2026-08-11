import { db } from "../config/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export class UserRepository {
  static async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  static async findById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  static async createUser(data: {
    email: string;
    passwordHash: string;
    name?: string;
    otp?: string;
    otpExpiresAt?: Date;
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
}