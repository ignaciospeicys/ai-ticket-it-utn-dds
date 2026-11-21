import express from "express";
import { createStore } from "./store.js";
import { listEvents } from "./catalog.js";
import { HttpError } from "./http.js";

export function createApp({ store = createStore() } = {}) {
  const app = express();
  app.use(express.json({ limit: "64kb" }));
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/demo/users", (_req, res) => res.json(store.users.filter(({ id }) => id !== "other")));
  app.get("/events", (req, res) => res.json(listEvents(store, req.query)));
  app.use((req, _res, next) => {
    req.user = store.users.find(({ id }) => id === req.get("x-demo-user"));
    if (!req.user) throw new HttpError(401, "Elegí una identidad de demo.");
    next();
  });
  app.get("/me", (req, res) => res.json(req.user));
  app.use((_req, _res, next) => next(new HttpError(404, "Ruta inexistente.")));
  app.use((error, _req, res, _next) => {
    const status = error.status ?? 500;
    if (status >= 500) console.error(error);
    res.status(status).json({ error: status >= 500 ? "Error interno." : error.message });
  });
  return app;
}
