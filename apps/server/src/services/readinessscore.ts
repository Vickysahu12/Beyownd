import { db } from "../config/db";
import { tasks } from "../db/schema/tasks.schema";
import { taskSubmissions } from "../db/schema/taskSubmissions.schema";
import { eq, sql } from "drizzle-orm";

// Readiness Score — on-the-fly calculation, no dedicated table needed.
// Formula (v1, simple): weighted mix of task completion + consistency.
// Tune the weights later once you have real usage data.
export async function calculateReadinessScore(userId: string) {
  // Total global tasks
  const totalResult = await db
    .select({ total: sql<number>`count(*)` })
    .from(tasks);
  
  const total = Number(totalResult[0]?.total || 0);

  if (total === 0) {
    return { score: 0, completedTasks: 0, totalTasks: 0 };
  }

  // Completed unique tasks for this specific user via submissions
  const completedResult = await db
    .select({ completed: sql<number>`count(distinct ${taskSubmissions.taskId})` })
    .from(taskSubmissions)
    .where(eq(taskSubmissions.userId, userId));

  const completed = Number(completedResult[0]?.completed || 0);

  const completionRate = completed / total; // 0 to 1
  const score = Math.round(completionRate * 100); // 0 to 100

  return {
    score,
    completedTasks: completed,
    totalTasks: total,
  };
}