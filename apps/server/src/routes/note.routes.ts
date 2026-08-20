import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import { z } from "zod";

const router = Router();
router.use(authenticate);

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  track: z.string().optional(),
  icon: z.string().optional(),
});

router.post("/", validate(noteSchema), adminOnly, NoteController.createNote);
router.get("/", NoteController.getNotes);
router.get("/:id", NoteController.getNoteById);

const progressSchema = z.object({
  progress: z.number().int().min(0).max(100),
});
router.put("/:id/progress", validate(progressSchema), NoteController.updateProgress);

router.put("/:id", NoteController.updateNote);
router.delete("/:id", NoteController.deleteNote);

export default router;