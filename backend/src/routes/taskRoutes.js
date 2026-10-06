import { Router } from "express";
import * as taskController from "../controllers/taskController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const taskRouter = Router();
taskRouter.use(requireAuth);

taskRouter.get("/", taskController.getAllTasks);