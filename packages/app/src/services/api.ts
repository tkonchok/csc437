// src/services/api.ts
const API = "http://localhost:3000";

export async function apiFetch(path: string, options: any = {}) {
  const legacyToken = localStorage.getItem("dra_token");
  const mustangToken = localStorage.getItem("mu:auth:jwt");
  const token = legacyToken || mustangToken || "";

  const headers: Record<string, string> = {
    ...(options.headers || {})
  };
  
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