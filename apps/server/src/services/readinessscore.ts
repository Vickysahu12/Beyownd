import { db } from "../config/db";
import { tasks } from "../db/schema";
import { eq, and } from "drizzle-orm";

// Readiness Score — on-the-fly calculation, no dedicated table needed.
// Formula (v1, simple): weighted mix of task completion + consistency.
// Tune the weights later once you have real usage data.
export async function calculateReadinessScore(userId: string) {
  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId));
    
  const total = userTasks.length;
  const completed = userTasks.filter((t) => t.status === "completed").length;

  if (total === 0) {
    return { score: 0, completedTasks: 0, totalTasks: 0 };
  }

  const completionRate = completed / total; // 0 to 1
  const score = Math.round(completionRate * 100); // 0 to 100

  return {
    score,
    completedTasks: completed,
    totalTasks: total,
  };
}