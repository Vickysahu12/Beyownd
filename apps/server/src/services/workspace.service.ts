import { WorkspaceRepository } from "../repositories/workspace.repository";
import { ApiError } from "../utils/ApiError";

export class WorkspaceService {
  private static generateSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${randomSuffix}`;
  }

  static async createWorkspace(userId: string, name: string) {
    if (!name || name.trim().length === 0) {
      throw new ApiError(400, "Workspace name is required");
    }

    const slug = this.generateSlug(name);

    const workspace = await WorkspaceRepository.createWorkspace({
      name,
      slug,
      ownerId: userId,
    });

    await WorkspaceRepository.addMember({
      workspaceId: workspace.id,
      userId,
      role: "OWNER",
    });

    return workspace;
  }

  static async getUserWorkspaces(userId: string) {
    return await WorkspaceRepository.getUserWorkspaces(userId);
  }
}