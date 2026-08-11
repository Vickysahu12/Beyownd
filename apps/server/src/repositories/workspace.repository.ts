import { db } from "../config/db";
import { workspaces, workspaceMembers } from "../db/schema/workspaces.schema";
import { eq, and } from "drizzle-orm";

export class WorkspaceRepository {
  static async createWorkspace(data: { name: string; slug: string; ownerId: string }) {
    const result = await db.insert(workspaces).values(data).returning();
    return result[0];
  }

  static async addMember(data: { workspaceId: string; userId: string; role: "OWNER" | "ADMIN" | "MEMBER" }) {
    const result = await db.insert(workspaceMembers).values(data).returning();
    return result[0];
  }

  static async findBySlug(slug: string) {
    const result = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
    return result[0] || null;
  }

  static async getUserWorkspaces(userId: string) {
    const members = await db
      .select({
        workspace: workspaces,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId));

    return members;
  }
}