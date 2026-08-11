import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const router = Router();
router.use(authenticate);

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

router.post("/", validate(noteSchema), NoteController.createNote);
router.get("/", NoteController.getNotes);
router.put("/:id", NoteController.updateNote);
router.delete("/:id", NoteController.deleteNote);

export default router;