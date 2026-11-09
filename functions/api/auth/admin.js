import { createSession, jsonError, readJson } from "../_shared/auth.js";
export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!env.ADMIN_PASSWORD || body.password !== env.ADMIN_PASSWORD) return jsonError("Unauthorized", 401);
  return createSession("admin", env);
}