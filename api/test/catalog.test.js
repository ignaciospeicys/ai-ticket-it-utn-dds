import assert from "node:assert/strict";
import { test } from "node:test";
import { startTestApi } from "../support/http-test.js";

test("el organizador publica un evento y el comprador lo puede guardar", async (t) => {
  const request = await startTestApi(t);
  const body = {
    title: "Teatro de verano", description: "Comedia", category: "Teatro",
    date: new Date(Date.now() + 86_400_000).toISOString(),
    tickets: [{ name: "General", price: 1000, capacity: 2 }, { name: "VIP", price: 2000, capacity: 1 }],
  };
  assert.equal((await request("/events", { user: "buyer", method: "POST", body })).status, 403);
  const published = await request("/events", { user: "organizer", method: "POST", body });
  assert.equal(published.status, 201);
  const event = await published.json();
  const catalog = await (await request("/events?sort=price")).json();
  assert.equal(catalog[0].id, event.id);

  for (let attempt = 0; attempt < 2; attempt++) {
    assert.equal((await request(`/favorites/${event.id}`, { user: "buyer", method: "PUT" })).status, 204);
  }
  const favorites = await (await request("/favorites", { user: "buyer" })).json();
  assert.deepEqual(favorites.map(({ id }) => id), [event.id]);
  const others = await (await request("/organizer/events", { user: "other" })).json();
  assert.ok(!others.some(({ id }) => id === event.id));
});
