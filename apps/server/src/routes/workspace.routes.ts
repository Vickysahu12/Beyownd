import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const router = Router();

// Secure all workspace routes with auth middleware
router.use(authenticate);

const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
});

router.post("/", validate(createWorkspaceSchema), WorkspaceController.createWorkspace);
router.get("/", WorkspaceController.getUserWorkspaces);

export default router;