import assert from "node:assert/strict";
import { test } from "node:test";
import { startTestApi } from "../support/http-test.js";

test("dos pedidos simultáneos sobre el último lugar crean una sola reserva", async (t) => {
  const request = await startTestApi(t);
  const reserve = () => request("/events/jazz/purchases", {
    user: "buyer", method: "POST", body: { ticketId: "general", quantity: 1 },
  });
  const responses = await Promise.all([reserve(), reserve()]);
  assert.deepEqual(responses.map(({ status }) => status).sort(), [201, 409]);
  const purchase = await responses.find(({ status }) => status === 201).json();
  assert.equal(purchase.status, "PENDING");
  const paid = await request(`/purchases/${purchase.id}/pay`, { user: "buyer", method: "POST" });
  const confirmed = await paid.json();
  assert.equal(confirmed.status, "CONFIRMED");
  assert.ok(confirmed.daysLeft > 0);
  const sales = await (await request("/organizer/events/jazz/sales", { user: "organizer" })).json();
  assert.equal(sales.tickets[0].available, 0);
  assert.equal((await request("/organizer/events/jazz/sales", { user: "other" })).status, 403);
});
