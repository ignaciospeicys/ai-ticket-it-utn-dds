import { randomUUID } from "node:crypto";
import { requiredText } from "./http.js";
import { purchaseForParticipant } from "./purchases.js";

export function listMessages(store, user, purchaseId) {
  purchaseForParticipant(store, purchaseId, user);
  return store.messages.filter((message) => message.purchaseId === purchaseId);
}

export function sendMessage(store, user, purchaseId, value, now) {
  purchaseForParticipant(store, purchaseId, user);
  const message = {
    id: randomUUID(), purchaseId, authorId: user.id, authorName: user.name,
    text: requiredText(value, "Mensaje", 1000), date: now.toISOString(),
  };
  store.messages.push(message);
  return message;
}
