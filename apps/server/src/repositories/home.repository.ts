import { db } from "../config/db";
import { tasks } from "../db/schema/tasks.schema";
import { notes } from "../db/schema/notes.schema";
import { taskSubmissions } from "../db/schema/taskSubmissions.schema";
import { userNoteProgress } from "../db/schema/userNoteProgress.schema";
import { dailyActivity } from "../db/schema/dailyActivity.schema";
import { eq, desc, asc, sql, notInArray } from "drizzle-orm";

export class HomeRepository {
  static async getTaskStats(userId: string) {
    const totalResult = await db.select({ total: sql<number>`count(*)` }).from(tasks);
    const completedResult = await db
      .select({ completed: sql<number>`count(distinct ${taskSubmissions.taskId})` })
      .from(taskSubmissions)
      .where(eq(taskSubmissions.userId, userId));
    return {
      total: Number(totalResult[0]?.total || 0),
      completed: Number(completedResult[0]?.completed || 0),
    };
  }

  static async getNoteStats(userId: string) {
    const totalResult = await db.select({ total: sql<number>`count(*)` }).from(notes);
    const progressResult = await db
      .select({
        avgProgress: sql<number>`coalesce(avg(${userNoteProgress.progress}), 0)`,
        completedCount: sql<number>`count(*) filter (where ${userNoteProgress.progress} >= 100)`,
      })
      .from(userNoteProgress)
      .where(eq(userNoteProgress.userId, userId));
    return {
      total: Number(totalResult[0]?.total || 0),
      avgProgress: Number(progressResult[0]?.avgProgress || 0),
      completedCount: Number(progressResult[0]?.completedCount || 0),
    };
  }

  static async getFeaturedTask(userId: string) {
    const submittedResult = await db
      .selectDistinct({ taskId: taskSubmissions.taskId })
      .from(taskSubmissions)
      .where(eq(taskSubmissions.userId, userId));
    const submittedIds = submittedResult.map((r) => r.taskId);

    const query = submittedIds.length > 0
      ? db.select().from(tasks).where(notInArray(tasks.id, submittedIds)).orderBy(asc(tasks.createdAt)).limit(1)
      : db.select().from(tasks).orderBy(asc(tasks.createdAt)).limit(1);

    const result = await query;
    return result[0] || null;
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