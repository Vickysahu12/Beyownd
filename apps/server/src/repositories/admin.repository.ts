import { db } from "../config/db";
import { tasks } from "../db/schema/tasks.schema";
import { notes } from "../db/schema/notes.schema";
import { users } from "../db/schema";
import { taskSubmissions } from "../db/schema/taskSubmissions.schema";
import { userNoteProgress } from "../db/schema/userNoteProgress.schema";
import { eq, desc, count, sql, inArray } from "drizzle-orm";

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

    // Tasks & Notes ab global hain, saare fetch honge
    const allTasks = await db.select().from(tasks);
    const allNotes = await db.select().from(notes);
    
    // User ke submissions aur note progress fetch karo
    const submissions = await db
      .select()
      .from(taskSubmissions)
      .where(eq(taskSubmissions.userId, id));

    const noteProgressRows = await db
      .select()
      .from(userNoteProgress)
      .where(eq(userNoteProgress.userId, id));

    const progressMap = new Map(noteProgressRows.map((p) => [p.noteId, p.progress]));

    // Tasks ke saath submission status map karo
    const tasksWithSubmissions = allTasks.map((t) => {
      const sub = submissions.find((s: any) => String(s.taskId) === String(t.id)) as any;

      const extractedUrl =
        sub?.submissionUrl ||
        sub?.submission_url ||
        sub?.githubRepoUrl ||
        sub?.github_repo_url ||
        sub?.githubRepo ||
        sub?.repoUrl ||
        sub?.link ||
        sub?.github_url ||
        sub?.url ||
        null;

      return {
        ...t,
        status: sub ? "completed" : "pending",
        githubRepoUrl: extractedUrl,
        submission_url: extractedUrl,
        submissionDetails: sub || null,
      };
    });

    // Notes ke saath progress map karo
    const notesWithProgress = allNotes.map((n) => ({
      ...n,
      progress: progressMap.get(n.id) || 0,
    }));

    return { 
      ...student, 
      tasks: tasksWithSubmissions, 
      notes: notesWithProgress, 
      submissions 
    };
  }

  static async getAnalytics() {
    const [totalStudents] = await db.select({ count: count() }).from(users);
    const [verifiedStudents] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isVerified, true));

    const [totalTasks] = await db.select({ count: count() }).from(tasks);
    
    // Total completed tasks across all users from taskSubmissions
    const [tasksCompleted] = await db
      .select({ count: count() })
      .from(taskSubmissions);

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
      completionRate: totalTasks.count > 0 ? Math.round((tasksCompleted.count / (totalTasks.count * (totalStudents.count || 1))) * 100) : 0,
      techInterestBreakdown,
      yearBreakdown,
      recentSignups: recentSignups.rows,
    };
  }

  static async getAllTasksGrouped() {
    // Kyunki tasks ab global hain, directly tasks table se fetch karenge
    const allTasks = await db.select().from(tasks);
    
    // Har task ke liye total submissions (completion count) nikal lo
    const result = [];
    for (const t of allTasks) {
      const [subCount] = await db
        .select({ count: count() })
        .from(taskSubmissions)
        .where(eq(taskSubmissions.taskId, t.id));

      result.push({
        id: t.id,
        title: t.title,
        description: t.description,
        difficulty: t.difficulty,
        estimated_hours: t.estimatedHours,
        dueDate: t.dueDate,
        total_assigned: await db.select({ count: count() }).from(users).then(res => res[0].count),
        total_completed: Number(subCount?.count || 0),
        ids: [t.id],
      });
    }
    return result;
  }

  static async getAllNotesGrouped() {
    const allNotes = await db.select().from(notes);
    return allNotes.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      track: n.track,
      icon: n.icon,
      total_assigned: 0,
      ids: [n.id],
    }));
  }

  static async broadcastTask(taskData: {
    title: string;
    description?: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedHours?: string;
    dueDate?: string;
    createdBy?: string;
  }) {
    // Tasks ab global hain, toh broadcast ka matlab ek single global task create karna hai
    const result = await db.insert(tasks).values({
      title: taskData.title,
      description: taskData.description,
      difficulty: taskData.difficulty,
      estimatedHours: taskData.estimatedHours,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      createdBy: taskData.createdBy,
    }).returning();

    return result;
  }

  static async broadcastNote(noteData: { title: string; content?: string; track?: string; icon?: string; createdBy?: string }) {
    // Notes bhi ab global hain, ek single global note create hoga
    const result = await db.insert(notes).values({
      title: noteData.title,
      content: noteData.content,
      track: noteData.track,
      icon: noteData.icon,
      createdBy: noteData.createdBy,
    }).returning();

    return result;
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