import { Router } from "express";
import * as habitController from "../controllers/habitController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const habitRouter = Router();
habitRouter.use(requireAuth);
habitRouter.param("id", habitController.checkId);

habitRouter.get("/", habitController.list);
habitRouter.post("/", habitController.create);
habitRouter.get("/:id", habitController.get);
habitRouter.patch("/:id", habitController.patch);
habitRouter.delete("/:id", habitController.remove);
// route supplémentaire (bonus journal) : coche / décoche un jour
habitRouter.post("/:id/toggle", habitController.toggle);
