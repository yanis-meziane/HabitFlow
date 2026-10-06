import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env.js";
import { taskRouter } from "./routes/taskRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { authRouter } from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
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

app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

app.use((err, _req, res, _next) => {
  const status = err.status ?? (err.name === "ValidationError" ? 400 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({
    message: status === 500 ? "Erreur serveur" : err.message
  });
});

export default app;