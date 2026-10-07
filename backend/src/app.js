import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import { config } from "./config/env.js";
import { ApiError, notFound } from "./errors.js";
import { authRouter } from "./routes/authRoutes.js";
import { habitRouter } from "./routes/habitRoutes.js";

const app = express();

const openapi = JSON.parse(readFileSync(new URL("../openapi.json", import.meta.url)));

app.use(express.json());
// monté avant helmet : sa politique CSP bloquerait les scripts de l'interface Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin
}));

app.get("/", (_request, response) => {
  response.status(200).json({ status: "API - Cours Dev Full stack" });
});
app.get("/api/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/habits", habitRouter);

app.use((_req, _res, next) => next(notFound("Route introuvable")));

// forme d'erreur commune : {"error":{"code","message"}}
app.use((err, _req, res, _next) => {
  let { status, code, message } = err;
  if (!(err instanceof ApiError)) {
    const badInput = err.type === "entity.parse.failed" || ["ValidationError", "CastError"].includes(err.name);
    status = badInput ? 400 : 500;
    code = badInput ? "INVALID_INPUT" : "INTERNAL_ERROR";
    message = badInput ? "Requête invalide" : "Erreur serveur";
    if (status === 500) console.error(err);
  }
  res.status(status).json({ error: { code, message } });
});

export default app;