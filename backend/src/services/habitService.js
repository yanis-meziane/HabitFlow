import { Habit } from "../models/Habit.js";
import { notFound } from "../errors.js";

// toutes les requêtes filtrent sur ownerId : l'objet d'un autre compte est "introuvable" (404)
const mine = (ownerId, id) => ({ _id: id, ownerId });

async function findOwned(ownerId, id) {
    const habit = await Habit.findOne(mine(ownerId, id));
    if (!habit) throw notFound("Habitude introuvable");
    return habit;
}

export const listHabits = (ownerId) => Habit.find({ ownerId }).sort("createdAt");

export const createHabit = (ownerId, data) => Habit.create({ ...data, ownerId });

export const getHabit = findOwned;

export async function updateHabit(ownerId, id, data) {
    const habit = await Habit.findOneAndUpdate(mine(ownerId, id), data, { returnDocument: 'after', runValidators: true });
    if (!habit) throw notFound("Habitude introuvable");
    return habit;
}

export async function deleteHabit(ownerId, id) {
    if (!(await Habit.findOneAndDelete(mine(ownerId, id)))) throw notFound("Habitude introuvable");
}

// coche / décoche un jour
export async function toggleDay(ownerId, id, date) {
    const habit = await findOwned(ownerId, id);
    const op = habit.completions.includes(date) ? { $pull: { completions: date } } : { $addToSet: { completions: date } };
    return Habit.findOneAndUpdate(mine(ownerId, id), op, { returnDocument: 'after' });
}
