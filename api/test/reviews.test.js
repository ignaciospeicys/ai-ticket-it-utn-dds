import assert from "node:assert/strict";
import { test } from "node:test";
import { startTestApi } from "../support/http-test.js";

test("solo una compra usada admite reseña y el catálogo incorpora su puntaje", async (t) => {
  const request = await startTestApi(t);
  const options = { user: "buyer", method: "POST", body: { rating: 5, comment: "Excelente acústica." } };
  const reservation = await request("/events/jazz/purchases", {
    ...options, body: { ticketId: "general", quantity: 1 },
  });
  const purchase = await reservation.json();
  assert.equal((await request(`/purchases/${purchase.id}/reviews`, options)).status, 409);
  assert.equal((await request("/purchases/used-demo/reviews", { ...options, user: "organizer" })).status, 403);
  assert.equal((await request("/purchases/used-demo/reviews", options)).status, 201);
  assert.equal((await request("/purchases/used-demo/reviews", options)).status, 409);
  const events = await (await request("/events?sort=rating")).json();
  assert.equal(events[0].id, "jazz");
  assert.equal(events[0].organizerRating, 5);
  const jazz = await (await request("/events/jazz")).json();
  assert.deepEqual(jazz.reviews.map(({ eventTitle }) => eventTitle), ["Sesión acústica"]);
  const theater = await (await request("/events/theater")).json();
  assert.deepEqual(theater.reviews, []);
});
