export async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}
export function jsonError(message, status=400) {
  return Response.json({ error: message }, { status });
}
export async function createSession(role, env) {
  if (!env.SESSION_SECRET) return jsonError("Server session secret is not configured", 503);
  const payload = btoa(JSON.stringify({ role, exp: Date.now() + 8 * 60 * 60 * 1000 }));
  const signature = await hmac(payload, env.SESSION_SECRET);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `ba_session=${payload}.${signature}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`
    }
  });
}
async function hmac(value, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}
export async function requireRole(request, env, role) {
  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.split(";").map(x=>x.trim()).find(x=>x.startsWith("ba_session="))?.slice(11);
  if (!token || !env.SESSION_SECRET) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || await hmac(payload, env.SESSION_SECRET) !== signature) return false;
  try { const data=JSON.parse(atob(payload)); return data.role===role && data.exp>Date.now(); } catch { return false; }
}