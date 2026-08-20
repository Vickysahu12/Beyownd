import { Router } from "express";
import { HomeController } from "../controllers/home.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);
router.get("/", HomeController.getDashboard);

export default router;