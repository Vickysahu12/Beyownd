import { db } from "../config/db";
import { notifications } from "../db/schema/notification.schema";
import { eq, and, desc } from "drizzle-orm";

export class NotificationService {
  static async getNotifications(userId: string) {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  static async markAsRead(notificationId: string, userId: string) {
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
      .returning();
    return updated;
  }

  static async markAllAsRead(userId: string) {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }
}