import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json(new ApiResponse(201, result, "User registered successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(new ApiResponse(200, result, "Logged in successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      res.status(200).json(new ApiResponse(200, result, "Access token refreshed successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.logout();
      res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
    } catch (error) {
      next(error);
    }
  }
  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.verifyOtp(req.body);
    res.status(200).json(new ApiResponse(200, result, "Email verified successfully"));
  } catch (error) {
    next(error);
  }
}
}