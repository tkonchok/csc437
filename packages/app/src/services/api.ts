// src/services/api.ts
// Small helper for talking to your Express backend with JWT

const API = "http://localhost:3000";

export async function apiFetch(path: string, options: any = {}) {
  // Your token from /auth/login:
  const legacyToken = localStorage.getItem("dra_token");

  // Old Mustang token (only used as a fallback, if ever)
  const mustangToken = localStorage.getItem("mu:auth:jwt");

  // ✅ Prefer the token that YOUR server issues
  const token = legacyToken || mustangToken || "";

  const headers: Record<string, string> = {
    ...(options.headers || {})
  };

  // Only force JSON when we're not sending FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}