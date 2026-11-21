import { randomUUID } from "node:crypto";
import { getEvent } from "./catalog.js";
import { HttpError, requiredText } from "./http.js";
import { purchaseForParticipant } from "./purchases.js";

function canReview(store, purchase, event, now) {
  return purchase.status === "USED" && Date.parse(event.date) < now.getTime() &&
    !store.reviews.some(({ purchaseId }) => purchaseId === purchase.id);
}

export function reviewEligibility(store, purchase, now) {
  return canReview(store, purchase, getEvent(store, purchase.eventId), now);
}

export function publishReview(store, user, purchaseId, { rating, comment } = {}, now) {
  const purchase = purchaseForParticipant(store, purchaseId, user);
  const event = getEvent(store, purchase.eventId);
  if (!canReview(store, purchase, event, now)) {
    throw new HttpError(409, "Esta compra no admite una reseña.");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new HttpError(400, "Elegí un puntaje entre 1 y 5.");
  }
  const review = {
    id: randomUUID(), purchaseId, eventId: event.id, organizerId: event.organizerId,
    authorName: user.name, eventTitle: event.title, rating,
    comment: requiredText(comment, "Comentario", 1000), date: now.toISOString(),
  };
  store.reviews.push(review);
  return review;
}

export function priorReviews(store, event, now) {
  const priorEvents = new Set(store.events
    .filter((item) => item.organizerId === event.organizerId &&
      Date.parse(item.date) < Math.min(Date.parse(event.date), now.getTime()))
    .map(({ id }) => id));
  return store.reviews.filter(({ eventId }) => priorEvents.has(eventId)).slice().reverse()
    .map(({ id, rating, comment, authorName, eventTitle, date }) => ({
      id, rating, comment, authorName, eventTitle, date,
    }));
}
