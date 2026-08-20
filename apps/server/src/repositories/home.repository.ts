import { db } from "../config/db";
import { tasks } from "../db/schema/tasks.schema";
import { notes } from "../db/schema/notes.schema";
import { dailyActivity } from "../db/schema/dailyActivity.schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";

export class HomeRepository {
  static async getTaskStats(userId: string) {
    const result = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`count(*) filter (where ${tasks.status} = 'completed')`,
      })
      .from(tasks)
      .where(eq(tasks.userId, userId));
    return result[0];
  }

  static async getNoteStats(userId: string) {
    const result = await db
      .select({
        total: sql<number>`count(*)`,
        avgProgress: sql<number>`coalesce(avg(${notes.progress}), 0)`,
        completedCount: sql<number>`count(*) filter (where ${notes.progress} >= 100)`,
      })
      .from(notes)
      .where(eq(notes.userId, userId));
    return result[0];
  }

  static async getFeaturedTask(userId: string) {
    const inProgress = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.status, "in_progress")))
      .orderBy(desc(tasks.updatedAt))
      .limit(1);

    if (inProgress[0]) return inProgress[0];

    const pending = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.status, "pending")))
      .orderBy(asc(tasks.createdAt))
      .limit(1);

    return pending[0] || null;
  }

  static async getRecentActivityDates(userId: string, days: number) {
    const result = await db
      .select({ activityDate: dailyActivity.activityDate })
      .from(dailyActivity)
      .where(eq(dailyActivity.userId, userId))
      .orderBy(desc(dailyActivity.activityDate))
      .limit(days);
    return result.map((r) => r.activityDate);
  }

  static async getSnapshotFromDaysAgo(userId: string, daysAgo: number) {
    const result = await db
      .select({ readinessSnapshot: dailyActivity.readinessSnapshot })
      .from(dailyActivity)
      .where(eq(dailyActivity.userId, userId))
      .orderBy(asc(dailyActivity.activityDate))
      .limit(1);
    return result[0]?.readinessSnapshot ?? null;
  }

  static async upsertTodaySnapshot(userId: string, readiness: number) {
    const today = new Date().toISOString().split("T")[0];
    await db
      .insert(dailyActivity)
      .values({ userId, activityDate: today, readinessSnapshot: readiness })
      .onConflictDoUpdate({
        target: [dailyActivity.userId, dailyActivity.activityDate],
        set: { readinessSnapshot: readiness },
      });
  }
}