import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import taskRoutes from "./task.routes";
import noteRoutes from "./note.routes";
import notificationRoutes from "./notification.routes";
import homeRoutes from "./home.routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/notes", noteRoutes);
router.use("/notifications", notificationRoutes);
router.use("/home", homeRoutes);

export default router;