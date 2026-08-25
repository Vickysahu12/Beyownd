import { db } from "../config/db"; // ⚠️ apna actual db import path confirm kar lena
import { tasks } from "../db/schema/tasks.schema";
import { notes } from "../db/schema/notes.schema";
import { dailyActivity } from "../db/schema/dailyActivity.schema";
import { users } from "../db/schema";
import { taskSubmissions } from "../db/schema/taskSubmissions.schema";
import { eq, sql, desc, count, avg } from "drizzle-orm";

export class AdminRepository {
  static async getAllStudents() {
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isVerified: users.isVerified,
        currentYear: users.currentYear,
        techInterest: users.techInterest,
        experienceLevel: users.experienceLevel,
        hasCompletedProfileSetup: users.hasCompletedProfileSetup,
        hasCompletedWorkspaceSetup: users.hasCompletedWorkspaceSetup,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  static async getStudentById(id: string) {
    const [student] = await db.select().from(users).where(eq(users.id, id));
    if (!student) return null;

    const studentTasks = await db.select().from(tasks).where(eq(tasks.userId, id));
    const studentNotes = await db.select().from(notes).where(eq(notes.userId, id));
    const submissions = await db
      .select()
      .from(taskSubmissions)
      .where(eq(taskSubmissions.userId, id));

    return { ...student, tasks: studentTasks, notes: studentNotes, submissions };
  }

  static async getAnalytics() {
    const [totalStudents] = await db.select({ count: count() }).from(users);
    const [verifiedStudents] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isVerified, true));

    const [tasksCompleted] = await db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.status, "completed"));

    const [totalTasks] = await db.select({ count: count() }).from(tasks);

    const techInterestBreakdown = await db
      .select({ techInterest: users.techInterest, count: count() })
      .from(users)
      .groupBy(users.techInterest);

    const yearBreakdown = await db
      .select({ currentYear: users.currentYear, count: count() })
      .from(users)
      .groupBy(users.currentYear);

    // Pichle 7 din ke signups — daily activity table use karke ya createdAt se group karke
    const recentSignups = await db.execute(sql`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    return {
      totalStudents: totalStudents.count,
      verifiedStudents: verifiedStudents.count,
      totalTasks: totalTasks.count,
      tasksCompleted: tasksCompleted.count,
      completionRate: totalTasks.count > 0 ? Math.round((tasksCompleted.count / totalTasks.count) * 100) : 0,
      techInterestBreakdown,
      yearBreakdown,
      recentSignups: recentSignups.rows,
    };
  }

  static async getAllVerifiedUserIds() {
    const rows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.isVerified, true));
    return rows.map((r) => r.id);
  }

  static async broadcastTask(taskData: {
    title: string;
    description?: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedHours?: string;
    dueDate?: string;
  }) {
    const userIds = await this.getAllVerifiedUserIds();
    if (userIds.length === 0) return [];

    const rows = userIds.map((userId) => ({
      userId,
      title: taskData.title,
      description: taskData.description,
      difficulty: taskData.difficulty,
      estimatedHours: taskData.estimatedHours,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
    }));

    return db.insert(tasks).values(rows).returning();
  }

  static async broadcastNote(noteData: { title: string; content?: string; track?: string; icon?: string }) {
    const userIds = await this.getAllVerifiedUserIds();
    if (userIds.length === 0) return [];

    const rows = userIds.map((userId) => ({
      userId,
      title: noteData.title,
      content: noteData.content,
      track: noteData.track,
      icon: noteData.icon,
    }));

    return db.insert(notes).values(rows).returning();
  }

  static async deleteTaskEverywhere(taskId: string) {
    return db.delete(tasks).where(eq(tasks.id, taskId));
  }

  static async deleteNoteEverywhere(noteId: string) {
    return db.delete(notes).where(eq(notes.id, noteId));
  }
}