import { createSession, jsonError, readJson } from "../_shared/auth.js";
export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!env.DEVELOPER_PASSWORD || body.password !== env.DEVELOPER_PASSWORD) return jsonError("Unauthorized", 401);
  return createSession("developer", env);
}