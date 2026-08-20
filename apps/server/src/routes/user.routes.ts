import { Router } from "express";
import { z } from "zod";
import { UserController } from "../controllers/user.controller";
import { ProfileController } from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { PreferenceController } from "../controllers/preference.controller";

const router = Router();

// 🔒 Apply authentication to ALL routes in user.routes
router.use(authenticate);
router.put("/complete-workspace-setup", UserController.completeWorkspaceSetup);

router.get("/me", UserController.getMe);
router.get("/preferences", PreferenceController.getPreferences);
router.put("/preferences", PreferenceController.updatePreferences);
router.get("/referrals", UserController.getReferrals);

// Profile-setup answers (year, tech interest, experience, weekly time, goal)
const profileSetupSchema = z.object({
  currentYear: z.string().min(1),
  techInterest: z.string().min(1),
  experienceLevel: z.string().min(1),
  weeklyTimeAvailable: z.string().min(1),
  primaryGoal: z.string().optional(),
});
router.put(
  "/profile-setup",
  validate(profileSetupSchema),
  ProfileController.saveProfileAnswers
);

export default router;