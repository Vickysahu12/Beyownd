import { db } from "../config/db";
import { tasks } from "../db/schema/tasks.schema";
import { notes } from "../db/schema/notes.schema";
import { users } from "../db/schema";
import { taskSubmissions } from "../db/schema/taskSubmissions.schema";
import { eq, desc, count, sql } from "drizzle-orm";

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

    // Fixes TypeScript error by using type casting and property fallbacks
    const tasksWithSubmissions = studentTasks.map((t) => {
      const sub = submissions.find((s) => s.taskId === t.id) as any;
      return {
        ...t,
        githubRepoUrl: sub?.githubRepoUrl || sub?.githubRepo || sub?.github_repo_url || null,
        submissionDetails: sub || null,
      };
    });

    return { ...student, tasks: tasksWithSubmissions, notes: studentNotes, submissions };
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

  static async getAllTasksGrouped() {
    return db
      .select({
        title: tasks.title,
        description: tasks.description,
        difficulty: tasks.difficulty,
        estimated_hours: tasks.estimatedHours,
        dueDate: tasks.dueDate,
        total_assigned: count(tasks.id),
        total_completed: sql<number>`SUM(CASE WHEN ${tasks.status} = 'completed' THEN 1 ELSE 0 END)`,
        ids: sql<string[]>`array_agg(${tasks.id})`,
      })
      .from(tasks)
      .groupBy(tasks.title, tasks.description, tasks.difficulty, tasks.estimatedHours, tasks.dueDate)
      .orderBy(desc(sql`MAX(${tasks.createdAt})`));
  }

  static async getAllNotesGrouped() {
    return db
      .select({
        title: notes.title,
        content: notes.content,
        track: notes.track,
        icon: notes.icon,
        total_assigned: count(notes.id),
        ids: sql<string[]>`array_agg(${notes.id})`,
      })
      .from(notes)
      .groupBy(notes.title, notes.content, notes.track, notes.icon)
      .orderBy(desc(sql`MAX(${notes.createdAt})`));
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

  static async deleteTaskEverywhere(taskIdOrTitle: string) {
    return db
      .delete(tasks)
      .where(
        sql`${tasks.id}::text = ${taskIdOrTitle} OR ${tasks.title} = ${taskIdOrTitle}`
      );
  }

  static async deleteNoteEverywhere(noteIdOrTitle: string) {
    return db
      .delete(notes)
      .where(
        sql`${notes.id}::text = ${noteIdOrTitle} OR ${notes.title} = ${noteIdOrTitle}`
      );
  }
}