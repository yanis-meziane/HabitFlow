import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function requireAuth(req, res, next) {
    const [scheme, token] = (req.header("Authorization") ?? "").split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Token absent" });
    }

    try {
        const payload = jwt.verify(token, config.jwtSecret);
        req.userId = payload._id;
        next();
    } catch {
        res.status(401).json({ message: "Token invalide" });
    }
}