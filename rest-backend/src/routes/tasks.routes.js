import { Router } from "express";

import {
  createTaskController,
  listTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController
} from "../controllers/tasks.controller.js";

import { validateBody } from "../middleware/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/tasks.schema.js";

const router = Router();

router.get("/", listTasksController);
router.get("/:id", getTaskController);

router.post("/", validateBody(createTaskSchema), createTaskController);
router.patch("/:id", validateBody(updateTaskSchema), updateTaskController);

router.delete("/:id", deleteTaskController);

export default router;
