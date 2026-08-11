import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { PreferenceController } from "../controllers/preference.controller";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";

const router = Router();

// 🔒 Apply authentication to ALL routes in user.routes
router.use(authenticate);

router.get("/me", UserController.getMe);
router.get("/preferences", PreferenceController.getPreferences);
router.put("/preferences", PreferenceController.updatePreferences);

// Onboarding route
router.put("/onboarding", async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const { category } = req.body;

    const result = await UserService.completeOnboarding(userId, category);
    res.status(200).json(new ApiResponse(200, result, "Onboarding completed successfully"));
  } catch (error) {
    next(error);
  }
});

export default router;