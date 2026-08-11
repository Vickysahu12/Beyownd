import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { sendOtpEmail } from "../utils/email";
import { ApiError } from "../utils/ApiError";

export class AuthService {
  private static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async signup(data: { email: string; password: string; name?: string }) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    const passwordHash = await hashPassword(data.password);
    const otp = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await UserRepository.createUser({
      email: data.email,
      passwordHash,
      name: data.name,
      otp,
      otpExpiresAt,
    });

    // Pass data.email (guaranteed string) to avoid string | null TypeScript error
    await sendOtpEmail(data.email, otp);

    return {
      message: "Registration successful. Please verify the OTP sent to your email.",
      email: user.email,
    };
  }

  static async verifyOtp(data: { email: string; otp: string }) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "User is already verified");
    }

    if (!user.otp || user.otp !== data.otp) {
      throw new ApiError(400, "Invalid OTP code");
    }

    if (user.otpExpiresAt && new Date() > new Date(user.otpExpiresAt)) {
      throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    await UserRepository.markAsVerified(user.id);

    const accessToken = generateAccessToken({ userId: user.id, email: user.email! });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email! });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: true,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(data: { email: string; password: string }) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email via OTP before logging in.");
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email! });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email! });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
    });

    return { accessToken: newAccessToken };
  }

  static async logout() {
    return { message: "Logged out successfully" };
  }
}