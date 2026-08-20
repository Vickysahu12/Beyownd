import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const router = Router();

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  referralCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const resendOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// Routes
router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp); 
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", validate(refreshTokenSchema), AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export default router;