import { UserRepository } from "../repositories/user.repository";
import { TokenRepository } from "../repositories/token.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { sendOtpEmail } from "../utils/email";
import { generateReferralCode } from "../utils/referral";
import { ApiError } from "../utils/ApiError";

const REFRESH_TOKEN_TTL_DAYS = 30;

function refreshTokenExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export class AuthService {
  private static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async signup(data: { email: string; password: string; name?: string; referralCode?: string }) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    let referredBy: string | undefined;
    if (data.referralCode) {
      const referrer = await UserRepository.findByReferralCode(data.referralCode);
      if (referrer) {
        referredBy = referrer.id;
      }
      // Invalid code diya to silently ignore — signup block mat karo
    }

    const passwordHash = await hashPassword(data.password);
    const otp = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let myReferralCode = generateReferralCode(data.name);
    let attempts = 0;
    while (await UserRepository.findByReferralCode(myReferralCode)) {
      myReferralCode = generateReferralCode(data.name);
      attempts++;
      if (attempts > 5) break;
    }

    const user = await UserRepository.createUser({
      email: data.email,
      passwordHash,
      name: data.name,
      otp,
      otpExpiresAt,
      referralCode: myReferralCode,
      referredBy,
    });

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

    await TokenRepository.store(user.id, refreshToken, refreshTokenExpiry());

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: true,
        hasCompletedProfileSetup: user.hasCompletedProfileSetup,
        hasCompletedWorkspaceSetup: user.hasCompletedWorkspaceSetup,
        referralCode: user.referralCode,
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

    await TokenRepository.store(user.id, refreshToken, refreshTokenExpiry());

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        hasCompletedProfileSetup: user.hasCompletedProfileSetup,
        hasCompletedWorkspaceSetup: user.hasCompletedWorkspaceSetup,
        referralCode: user.referralCode,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    const payload = verifyRefreshToken(oldRefreshToken);
    const storedToken = await TokenRepository.findValid(oldRefreshToken);
    if (!storedToken) {
      throw new ApiError(401, "Refresh token is invalid, expired, or has been revoked");
    }

    await TokenRepository.revoke(oldRefreshToken);

    const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email });
    const newRefreshToken = generateRefreshToken({ userId: payload.userId, email: payload.email });

    await TokenRepository.store(payload.userId, newRefreshToken, refreshTokenExpiry());

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshToken: string) {
    if (refreshToken) {
      await TokenRepository.revoke(refreshToken);
    }
    return { message: "Logged out successfully" };
  }
}