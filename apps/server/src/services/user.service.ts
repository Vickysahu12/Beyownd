import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";

export class UserService {
  static async getUserById(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }
}