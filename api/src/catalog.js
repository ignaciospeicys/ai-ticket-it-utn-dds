import { findRecord } from "./http.js";

export function listEvents(store, { q, category } = {}) {
  const query = typeof q === "string" ? q.trim().toLocaleLowerCase("es") : "";
  return store.events
    .filter((event) => !category || event.category === category)
    .filter((event) => `${event.title} ${event.description}`.toLocaleLowerCase("es").includes(query))
    .map((event) => describeEvent(store, event));
}

export function describeEvent(store, event) {
  const organizer = findRecord(store.users, event.organizerId, "Organizador inexistente.");
  return {
    ...event,
    organizerName: organizer.name,
    minPrice: Math.min(...event.tickets.map((ticket) => ticket.price)),
  };
}
