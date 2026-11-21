const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";

export async function api(path, { user, method = "GET", body } = {}) {
  const headers = {};
  if (user) headers["x-demo-user"] = user.id;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "No se pudo completar la solicitud.");
  return data;
}
