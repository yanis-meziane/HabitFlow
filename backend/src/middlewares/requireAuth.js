import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { unauthorized } from "../errors.js";

export function requireAuth(req, _res, next) {
    const [scheme, token] = (req.header("Authorization") ?? "").split(" ");

    if (scheme !== "Bearer" || !token) return next(unauthorized("Token absent"));

    try {
        req.userId = jwt.verify(token, config.jwtSecret)._id;
        next();
    } catch {
        next(unauthorized("Token invalide"));
    }
}
