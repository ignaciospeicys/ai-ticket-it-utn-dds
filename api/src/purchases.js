import { randomUUID } from "node:crypto";
import { getEvent } from "./catalog.js";
import { findRecord, HttpError } from "./http.js";

const occupying = new Set(["PENDING", "CONFIRMED", "USED"]);

export function availability(store, event) {
  const reserved = new Map();
  for (const purchase of store.purchases) {
    if (purchase.eventId !== event.id || !occupying.has(purchase.status)) continue;
    reserved.set(purchase.ticketId, (reserved.get(purchase.ticketId) ?? 0) + purchase.quantity);
  }
  return event.tickets.map((ticket) => ({
    ...ticket, available: ticket.capacity - (reserved.get(ticket.id) ?? 0),
  }));
}

export function purchaseForParticipant(store, id, user) {
  const purchase = findRecord(store.purchases, id, "Compra inexistente.");
  const event = getEvent(store, purchase.eventId);
  if (purchase.buyerId !== user.id && event.organizerId !== user.id) {
    throw new HttpError(403, "Esta compra pertenece a otra persona.");
  }
  return purchase;
}

export function describePurchase(store, purchase, now) {
  const event = getEvent(store, purchase.eventId);
  const ticket = findRecord(event.tickets, purchase.ticketId, "Tipo de entrada inexistente.");
  const buyer = findRecord(store.users, purchase.buyerId, "Comprador inexistente.");
  return {
    ...purchase,
    eventTitle: event.title,
    eventDate: event.date,
    ticketName: ticket.name,
    buyerName: buyer.name,
    total: purchase.quantity * purchase.unitPrice,
    daysLeft: purchase.status === "CONFIRMED"
      ? Math.max(0, Math.ceil((Date.parse(event.date) - now.getTime()) / 86_400_000))
      : null,
  };
}

export function reserve(store, user, eventId, { ticketId, quantity } = {}, now) {
  const event = getEvent(store, eventId);
  if (Date.parse(event.date) <= now.getTime()) throw new HttpError(409, "La venta de este evento cerró.");
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new HttpError(400, "La cantidad debe ser un entero positivo.");
  }
  const ticket = findRecord(availability(store, event), ticketId, "Tipo de entrada inexistente.");
  if (quantity > ticket.available) throw new HttpError(409, "No quedan suficientes entradas de este tipo.");
  const purchase = {
    id: randomUUID(), eventId, ticketId, buyerId: user.id, quantity,
    unitPrice: ticket.price, status: "PENDING", createdAt: now.toISOString(),
  };
  store.purchases.push(purchase);
  return describePurchase(store, purchase, now);
}

export function pay(store, user, id, now) {
  const purchase = purchaseForParticipant(store, id, user);
  if (purchase.status !== "PENDING" || Date.parse(getEvent(store, purchase.eventId).date) <= now.getTime()) {
    throw new HttpError(409, "La compra no admite el pago.");
  }
  purchase.status = "CONFIRMED";
  return describePurchase(store, purchase, now);
}

export function eventSales(store, user, id, now) {
  const event = getEvent(store, id);
  if (event.organizerId !== user.id) throw new HttpError(403, "El evento pertenece a otro organizador.");
  return {
    title: event.title,
    tickets: availability(store, event),
    purchases: store.purchases
      .filter(({ eventId }) => eventId === id)
      .map((purchase) => describePurchase(store, purchase, now)),
  };
}
