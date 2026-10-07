import { Router } from "express";
import { Habit, DATE_KEY } from "../models/Habit.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const habitRouter = Router();
habitRouter.use(requireAuth);

const pick = ({ name, frequency, color } = {}) => ({ name, frequency, color });
const httpError = (status, message) => Object.assign(new Error(message), { status });
const mine = (req) => ({ _id: req.params.id, ownerId: req.userId });

habitRouter.get("/", async (req, res) => {
    res.json(await Habit.find({ ownerId: req.userId }).sort("createdAt"));
});

habitRouter.post("/", async (req, res) => {
    res.status(201).json(await Habit.create({ ...pick(req.body), ownerId: req.userId }));
});

habitRouter.put("/:id", async (req, res) => {
    const habit = await Habit.findOneAndUpdate(mine(req), pick(req.body), {
        new: true, runValidators: true, omitUndefined: true,
    });
    if (!habit) throw httpError(404, "Habitude introuvable");
    res.json(habit);
});

// coche / décoche un jour : { date: "YYYY-MM-DD" }
habitRouter.post("/:id/toggle", async (req, res) => {
    const date = req.body?.date;
    if (!DATE_KEY.test(date ?? "")) throw httpError(400, "Date invalide (YYYY-MM-DD)");

    const habit = await Habit.findOne(mine(req));
    if (!habit) throw httpError(404, "Habitude introuvable");

    const op = habit.completions.includes(date) ? { $pull: { completions: date } } : { $addToSet: { completions: date } };
    res.json(await Habit.findOneAndUpdate(mine(req), op, { new: true }));
});

habitRouter.delete("/:id", async (req, res) => {
    if (!(await Habit.findOneAndDelete(mine(req)))) throw httpError(404, "Habitude introuvable");
    res.status(204).end();
});
