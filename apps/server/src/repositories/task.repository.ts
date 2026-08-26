import { db } from "../config/db";
import { tasks } from "../db/schema/tasks.schema";
import { taskSubmissions } from "../db/schema/taskSubmissions.schema";
import { eq, and, desc } from "drizzle-orm";

export class TaskRepository {
  static async createTask(data: {
    title: string;
    description?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
    estimatedHours?: string;
    dueDate?: Date;
    createdBy?: string;
  }) {
    const result = await db.insert(tasks).values(data).returning();
    return result[0];
  }

  static async getAllTasks() {
    return await db.select().from(tasks);
  }

  static async getTaskById(taskId: string) {
    const result = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
    return result[0] || null;
  }

  static async updateTask(
    taskId: string,
    updateData: Partial<{
      title: string;
      description: string;
      difficulty: "beginner" | "intermediate" | "advanced";
      estimatedHours: string;
      dueDate: Date;
    }>
  ) {
    const result = await db
      .update(tasks)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(tasks.id, taskId))
      .returning();
    return result[0];
  }

  static async deleteTask(taskId: string) {
    const result = await db.delete(tasks).where(eq(tasks.id, taskId)).returning();
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

  static async findSubmittedTaskIds(userId: string) {
    const result = await db
      .selectDistinct({ taskId: taskSubmissions.taskId })
      .from(taskSubmissions)
      .where(eq(taskSubmissions.userId, userId));
    return result.map((r) => r.taskId);
  }
}