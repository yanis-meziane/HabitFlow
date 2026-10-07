import * as habitService from "../services/habitService.js";
import { assertObjectId } from "../validators/common.js";
import { validateCreate, validatePatch, validateToggle } from "../validators/habitValidator.js";

export async function list(req, res) {
    res.status(200).json({ items: await habitService.listHabits(req.userId) });
}

export async function create(req, res) {
    const data = validateCreate(req.body);
    res.status(201).json(await habitService.createHabit(req.userId, data));
}

export async function get(req, res) {
    res.status(200).json(await habitService.getHabit(req.userId, req.params.id));
}

export async function patch(req, res) {
    const data = validatePatch(req.body);
    res.status(200).json(await habitService.updateHabit(req.userId, req.params.id, data));
}

export async function remove(req, res) {
    await habitService.deleteHabit(req.userId, req.params.id);
    res.status(204).end();
}

export async function toggle(req, res) {
    const date = validateToggle(req.body);
    res.status(200).json(await habitService.toggleDay(req.userId, req.params.id, date));
}

export const checkId = (_req, _res, next, id) => {
    assertObjectId(id);
    next();
};
