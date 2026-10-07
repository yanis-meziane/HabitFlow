import { Router } from "express";
import { Habit } from "../models/Habit.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const habitRouter = Router();
habitRouter.use(requireAuth);

const pick = ({ name, frequency, done } = {}) => ({ name, frequency, done });
const notFound = () => Object.assign(new Error("Habitude introuvable"), { status: 404 });

habitRouter.get("/", async (req, res) => {
    res.json(await Habit.find({ ownerId: req.userId }).sort("createdAt"));
});

habitRouter.post("/", async (req, res) => {
    res.status(201).json(await Habit.create({ ...pick(req.body), ownerId: req.userId }));
});

habitRouter.put("/:id", async (req, res) => {
    const habit = await Habit.findOneAndUpdate(
        { _id: req.params.id, ownerId: req.userId },
        pick(req.body),
        { new: true, runValidators: true, omitUndefined: true }
    );
    if (!habit) throw notFound();
    res.json(habit);
});

habitRouter.delete("/:id", async (req, res) => {
    if (!(await Habit.findOneAndDelete({ _id: req.params.id, ownerId: req.userId }))) throw notFound();
    res.status(204).end();
});
