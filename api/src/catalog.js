import { randomUUID } from "node:crypto";
import { findRecord, HttpError, requiredText } from "./http.js";

export function listEvents(store, { q, category, sort = "date" } = {}, events = store.events) {
  const query = typeof q === "string" ? q.trim().toLocaleLowerCase("es") : "";
  const ordering = {
    price: (a, b) => a.minPrice - b.minPrice,
    date: (a, b) => Date.parse(a.date) - Date.parse(b.date),
    rating: (a, b) => (b.organizerRating ?? 0) - (a.organizerRating ?? 0),
  };
  if (!Object.hasOwn(ordering, sort)) throw new HttpError(400, "Orden inválido.");
  return events
    .filter((event) => !category || event.category === category)
    .filter((event) => `${event.title} ${event.description}`.toLocaleLowerCase("es").includes(query))
    .map((event) => describeEvent(store, event))
    .sort((a, b) => ordering[sort](a, b) || a.id.localeCompare(b.id));
}

export function getEvent(store, id) {
  return findRecord(store.events, id, "Evento inexistente.");
}

export function describeEvent(store, event) {
  const organizer = findRecord(store.users, event.organizerId, "Organizador inexistente.");
  const reviews = store.reviews.filter((review) => review.organizerId === organizer.id);
  return {
    ...event,
    organizerName: organizer.name,
    minPrice: Math.min(...event.tickets.map((ticket) => ticket.price)),
    organizerRating: reviews.length
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : null,
  };
}

export function publishEvent(store, organizer, data, now) {
  const { title, description, category, date, imageUrl, tickets } = data ?? {};
  if (typeof date !== "string" || !Number.isFinite(Date.parse(date)) || Date.parse(date) <= now.getTime()) {
    throw new HttpError(400, "Ingresá una fecha futura.");
  }
  if (!Array.isArray(tickets) || tickets.length < 1 || tickets.length > 20) {
    throw new HttpError(400, "Ingresá entre uno y veinte tipos de entrada.");
  }
  const names = new Set();
  const types = tickets.map((ticket) => {
    const name = requiredText(ticket?.name, "Nombre de la entrada", 80);
    const key = name.toLocaleLowerCase("es");
    if (names.has(key)) throw new HttpError(400, "Los tipos de entrada deben tener nombres distintos.");
    names.add(key);
    const { price, capacity } = ticket;
    if (!Number.isSafeInteger(price) || price < 0 || price > 100_000_000 ||
        !Number.isSafeInteger(capacity) || capacity < 1 || capacity > 100_000) {
      throw new HttpError(400, "Ingresá un precio válido y un cupo entero positivo.");
    }
    return { id: randomUUID(), name, price, capacity };
  });
  const event = {
    id: randomUUID(),
    organizerId: organizer.id,
    title: requiredText(title, "Título"),
    description: requiredText(description, "Descripción", 3000),
    category: requiredText(category, "Categoría", 60),
    date: new Date(date).toISOString(),
    imageUrl: optionalImageUrl(imageUrl),
    tickets: types,
  };
  store.events.push(event);
  return describeEvent(store, event);
}

function optionalImageUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === "https:") return url.href;
  } catch {
    // A malformed URL is reported as a validation error below.
  }
  throw new HttpError(400, "La imagen debe tener una URL HTTPS válida.");
}
