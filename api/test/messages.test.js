import assert from "node:assert/strict";
import { test } from "node:test";
import { startTestApi } from "../support/http-test.js";

test("ambas partes pueden conversar sobre una compra y terceros no pueden acceder", async (t) => {
  const request = await startTestApi(t);
  const path = "/purchases/used-demo/messages";
  for (const [user, text] of [["buyer", "¿A qué hora abre?"], ["organizer", "A las ocho."]]) {
    assert.equal((await request(path, { user, method: "POST", body: { text } })).status, 201);
  }
  const history = await (await request(path, { user: "buyer" })).json();
  assert.deepEqual(history.map(({ authorId }) => authorId), ["buyer", "organizer"]);
  assert.equal((await request(path, { user: "other" })).status, 403);
  assert.equal((await request(path, { user: "other", method: "POST", body: { text: "Hola" } })).status, 403);
  assert.equal((await request(path, { user: "buyer", method: "POST", body: { text: " " } })).status, 400);
});
