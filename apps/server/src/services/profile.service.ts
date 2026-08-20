import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";

export class ProfileService {
  static async saveProfileAnswers(
    userId: string,
    answers: {
      currentYear: string;
      techInterest: string;
      experienceLevel: string;
      weeklyTimeAvailable: string;
      primaryGoal?: string;
    }
  ) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const updated = await UserRepository.saveProfileAnswers(userId, answers);
    const { passwordHash, otp, otpExpiresAt, ...safeUser } = updated;
    return safeUser;
  }
}