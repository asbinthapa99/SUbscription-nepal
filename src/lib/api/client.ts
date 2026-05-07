const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  const text = await res.text();
  let data: unknown;
  try { data = text ? JSON.parse(text) : undefined; } catch { data = text; }
  if (!res.ok) {
    const msg = (data as Record<string, unknown>)?.message as string ?? res.statusText ?? "Request failed";
    throw new Error(msg);
  }
  return data as T;
}
