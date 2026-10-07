import * as authService from "../services/authService.js";

export async function register(req, res) {
    res.status(201).json(await authService.register(req.body));
}

export async function login(req, res) {
    res.status(200).json(await authService.login(req.body));
}
