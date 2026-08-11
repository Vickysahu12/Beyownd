import { db } from "../config/db";
import { users } from "../db/schema/users.schema";
import { eq } from "drizzle-orm";
import { UserRepository } from "../repositories/user.repository";
import { WorkspaceService } from "./workspace.service";
import { ApiError } from "../utils/ApiError";

export class UserService {
  static async getUserById(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  static async completeOnboarding(userId: string, category: string) {
    if (!category) {
      throw new ApiError(400, "Category is required");
    }

    // 1. Automatically create default workspace for selected category
    const workspace = await WorkspaceService.createWorkspace(userId, category);

    // 2. Mark user onboarding as complete
    const [updatedUser] = await db
      .update(users)
      .set({
        hasCompletedOnboarding: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return {
      user: updatedUser,
      workspace,
    };
  }
}