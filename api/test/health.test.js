import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.js";

test("devuelve el estado de la API y permite buscar eventos por texto y categoría", async (t) => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${base}/health`);
  assert.deepEqual(await health.json(), { status: "ok" });
  const events = await fetch(`${base}/events?q=jazz&category=M%C3%BAsica`);
  assert.deepEqual((await events.json()).map(({ id }) => id), ["jazz"]);
  const privateRoute = await fetch(`${base}/me`);
  assert.equal(privateRoute.status, 401);
});
