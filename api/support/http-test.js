import { createApp } from "../src/app.js";

export async function startTestApi(t, options) {
  const server = createApp(options).listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  t.after(() => server.close());
  return (path, { user, method = "GET", body } = {}) => {
    const headers = {};
    if (user) headers["x-demo-user"] = user;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    return fetch(`http://127.0.0.1:${server.address().port}${path}`, {
      method, headers, body: JSON.stringify(body),
    });
  };
}
