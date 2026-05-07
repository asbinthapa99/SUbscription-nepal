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
  
  if (res.status === 401) {
    if (typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register") &&
        !window.location.pathname.startsWith("/forgot") &&
        window.location.pathname !== "/") {
      window.location.href = "/login?expired=true";
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    const msg = (typeof data === "object" && data !== null && "message" in data)
      ? String((data as Record<string, unknown>).message)
      : res.statusText ?? "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

