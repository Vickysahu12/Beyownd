import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
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
const updateTaskSchema = createTaskSchema.partial();

const submitSchema = z.object({
  submissionType: z.enum(["link", "text", "file"]).default("link"),
  submissionUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

router.get("/", TaskController.getTasks);
router.get("/:id", TaskController.getTaskById);
router.post("/", validate(createTaskSchema), adminOnly, TaskController.createTask);
router.put("/:id", validate(updateTaskSchema), adminOnly, TaskController.updateTask);
router.delete("/:id", adminOnly, TaskController.deleteTask);
router.post("/:id/submit", validate(submitSchema), TaskController.submitTask);

export default router;