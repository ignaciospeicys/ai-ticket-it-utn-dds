import express from "express";
import { createStore } from "./store.js";
import { describeEvent, getEvent, listEvents, publishEvent } from "./catalog.js";
import { HttpError, requireRole } from "./http.js";
import { availability, describePurchase, eventSales, pay, purchaseForParticipant, reserve } from "./purchases.js";

export function createApp({ store = createStore(), clock = () => new Date() } = {}) {
  const app = express();
  app.use((req, res, next) => {
    const origin = req.get("origin");
    res.vary("Origin");
    if (origin && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set("Access-Control-Allow-Headers", "Content-Type, X-Demo-User");
      res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      if (req.method === "OPTIONS") return res.sendStatus(204);
    }
    next();
  });
  app.use(express.json({ limit: "64kb" }));
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/demo/users", (_req, res) => res.json(store.users.filter(({ id }) => id !== "other")));
  app.get("/categories", (_req, res) => res.json([...new Set(store.events.map(({ category }) => category))].sort()));
  app.get("/events", (req, res) => {
    const upcoming = store.events.filter((event) => Date.parse(event.date) >= clock().getTime());
    res.json(listEvents(store, req.query, upcoming));
  });
  app.get("/events/:id", (req, res) => {
    const event = getEvent(store, req.params.id);
    res.json({
      ...describeEvent(store, event),
      tickets: availability(store, event),
      salesOpen: Date.parse(event.date) > clock().getTime(),
    });
  });
  app.use((req, _res, next) => {
    req.user = store.users.find(({ id }) => id === req.get("x-demo-user"));
    if (!req.user) throw new HttpError(401, "Elegí una identidad de demo.");
    next();
  });
  app.get("/me", (req, res) => res.json(req.user));
  app.get("/favorites", requireRole("buyer"), (req, res) => {
    const favorites = store.favorites.get(req.user.id);
    res.json(listEvents(store, {}, store.events.filter(({ id }) => favorites?.has(id))));
  });
  app.put("/favorites/:id", requireRole("buyer"), (req, res) => {
    const event = getEvent(store, req.params.id);
    const favorites = store.favorites.get(req.user.id) ?? new Set();
    favorites.add(event.id);
    store.favorites.set(req.user.id, favorites);
    res.sendStatus(204);
  });
  app.delete("/favorites/:id", requireRole("buyer"), (req, res) => {
    store.favorites.get(req.user.id)?.delete(req.params.id);
    res.sendStatus(204);
  });
  app.get("/organizer/events", requireRole("organizer"), (req, res) => {
    res.json(listEvents(store, {}, store.events.filter(({ organizerId }) => organizerId === req.user.id)));
  });
  app.post("/events", requireRole("organizer"), (req, res) => {
    res.status(201).json(publishEvent(store, req.user, req.body, clock()));
  });
  app.post("/events/:id/purchases", requireRole("buyer"), (req, res) => {
    res.status(201).json(reserve(store, req.user, req.params.id, req.body ?? {}, clock()));
  });
  app.get("/purchases", requireRole("buyer"), (req, res) => {
    const now = clock();
    res.json(store.purchases.filter(({ buyerId }) => buyerId === req.user.id)
      .map((purchase) => describePurchase(store, purchase, now)));
  });
  app.get("/purchases/:id", (req, res) => {
    res.json(describePurchase(store, purchaseForParticipant(store, req.params.id, req.user), clock()));
  });
  app.post("/purchases/:id/pay", requireRole("buyer"), (req, res) => {
    res.json(pay(store, req.user, req.params.id, clock()));
  });
  app.get("/organizer/events/:id/sales", requireRole("organizer"), (req, res) => {
    res.json(eventSales(store, req.user, req.params.id, clock()));
  });
  app.use((_req, _res, next) => next(new HttpError(404, "Ruta inexistente.")));
  app.use((error, _req, res, _next) => {
    const status = error.status ?? 500;
    if (status >= 500) console.error(error);
    res.status(status).json({ error: status >= 500 ? "Error interno." : error.message });
  });
  return app;
}
