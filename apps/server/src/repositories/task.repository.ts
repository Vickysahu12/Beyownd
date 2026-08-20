import { db } from "../config/db";
import { tasks } from "../db/schema/tasks.schema";
import { taskSubmissions } from "../db/schema/taskSubmissions.schema";
import { eq, and, desc } from "drizzle-orm";

export class TaskRepository {
  static async createTask(data: {
    userId: string;
    title: string;
    description?: string;
    status?: "pending" | "in_progress" | "completed";
    dueDate?: Date;
  }) {
    const result = await db.insert(tasks).values(data).returning();
    return result[0];
  }

  static async getUserTasks(userId: string) {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  static async getTaskById(taskId: string, userId: string) {
    const result = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);
    return result[0] || null;
  }

  static async updateTask(
    taskId: string,
    userId: string,
    updateData: Partial<{
      title: string;
      description: string;
      status: "pending" | "in_progress" | "completed";
      dueDate: Date;
    }>
  ) {
    const result = await db
      .update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();
    return result[0];
  }

  static async deleteTask(taskId: string, userId: string) {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();
    return result[0];
  }

  static async createSubmission(data: {
  taskId: string;
  userId: string;
  submissionType: "link" | "text" | "file";
  submissionUrl?: string;
  notes?: string;
}) {
  const result = await db.insert(taskSubmissions).values(data).returning();
  return result[0];
}

static async findSubmissionsByTask(taskId: string, userId: string) {
  return db
    .select()
    .from(taskSubmissions)
    .where(and(eq(taskSubmissions.taskId, taskId), eq(taskSubmissions.userId, userId)))
    .orderBy(desc(taskSubmissions.submittedAt));
}
}