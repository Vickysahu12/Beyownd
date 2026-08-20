import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const router = Router();

router.use(authenticate);

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  estimatedHours: z.string().optional(),
  dueDate: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed"]),
});

const submitSchema = z.object({
  submissionType: z.enum(["link", "text", "file"]).default("link"),
  submissionUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

router.get("/:id", TaskController.getTaskById);
router.post("/:id/submit", validate(submitSchema), TaskController.submitTask);

router.post("/", validate(createTaskSchema), TaskController.createTask);
router.get("/", TaskController.getTasks);
router.patch("/:id/status", validate(updateStatusSchema), TaskController.updateTaskStatus);
router.delete("/:id", TaskController.deleteTask);

export default router;