import { db } from "../config/db";
import { userPreferences } from "../db/schema/preference.schema";
import { eq } from "drizzle-orm";

export class PreferenceService {
  static async getPreferences(userId: string) {
    let [pref] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    
    // Default create agar exist nahi karti
    if (!pref) {
      [pref] = await db.insert(userPreferences).values({ userId }).returning();
    }
    return pref;
  }

  static async updatePreferences(
    userId: string,
    data: Partial<{ theme: string; emailAlerts: boolean; pushNotifications: boolean }>
  ) {
    await this.getPreferences(userId); // ensure row exists

    const [updated] = await db
      .update(userPreferences)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId))
      .returning();
      
    return updated;
  }
}