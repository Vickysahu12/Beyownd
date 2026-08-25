import { Router } from "express";
import { z } from "zod";
import { AdminController } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(authenticate);
router.use(adminOnly);

router.get("/students", AdminController.getStudents);
router.get("/students/:id", AdminController.getStudentById);
router.get("/analytics", AdminController.getAnalytics);

// ⬇️ GET BROADCASTED TASKS ROUTE ⬇️
router.get("/tasks", AdminController.getTasks);

const broadcastTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedHours: z.string().optional(),
  dueDate: z.string().optional(),
});

const broadcastNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  track: z.string().optional(),
  icon: z.string().optional(),
});

router.post("/tasks", validate(broadcastTaskSchema), AdminController.createTask);
router.delete("/tasks/:id", AdminController.deleteTask);

router.post("/notes", validate(broadcastNoteSchema), AdminController.createNote);
router.delete("/notes/:id", AdminController.deleteNote);

export default router;