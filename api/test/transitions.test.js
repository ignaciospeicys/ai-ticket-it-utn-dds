import assert from "node:assert/strict";
import { test } from "node:test";
import { createStore } from "../src/store.js";
import { startTestApi } from "../support/http-test.js";

test("cancelar una compra confirmada reembolsa y libera el cupo una vez", async (t) => {
  const request = await startTestApi(t);
  const buyer = { user: "buyer", method: "POST" };
  const reserve = () => request("/events/jazz/purchases", { ...buyer, body: { ticketId: "general", quantity: 1 } });
  const purchase = await (await reserve()).json();
  await request(`/purchases/${purchase.id}/pay`, buyer);
  assert.equal((await (await request(`/purchases/${purchase.id}/cancel`, buyer)).json()).status, "REFUNDED");
  assert.equal((await request(`/purchases/${purchase.id}/cancel`, buyer)).status, 409);
  assert.equal((await reserve()).status, 201);
  assert.equal((await reserve()).status, 409);
});

test("una compra utilizada o que ya llegó al evento no se puede cancelar", async (t) => {
  const start = new Date("2026-11-21T15:00:00Z");
  let now = start;
  const store = createStore(start);
  const request = await startTestApi(t, { store, clock: () => now });
  const buyer = { user: "buyer", method: "POST" };
  assert.equal((await request("/purchases/used-demo/cancel", buyer)).status, 409);
  const purchase = await (await request("/events/jazz/purchases", {
    ...buyer, body: { ticketId: "general", quantity: 1 },
  })).json();
  await request(`/purchases/${purchase.id}/pay`, buyer);
  const use = () => request(`/purchases/${purchase.id}/use`, { user: "organizer", method: "POST" });
  assert.equal((await use()).status, 409);
  now = new Date(store.events.find(({ id }) => id === "jazz").date);
  assert.equal((await request(`/purchases/${purchase.id}/cancel`, buyer)).status, 409);
  assert.equal((await (await use()).json()).status, "USED");
});
