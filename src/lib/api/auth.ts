const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type LoginInput = { email: string; password: string };
type RegisterInput = { name: string; email: string; password: string };

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data: any = undefined;
  try { data = text ? JSON.parse(text) : undefined; } catch (e) { data = text; }

  if (!res.ok) {
    const message = data?.message || data || res.statusText || "Request failed";
    throw new Error(message);
  }

  return data;
}

export async function apiRegister(input: RegisterInput) {
  return request(`/api/auth/register`, { method: "POST", body: JSON.stringify(input) });
}

export async function apiLogin(input: LoginInput) {
  return request(`/api/auth/login`, { method: "POST", body: JSON.stringify(input) });
}

export async function apiMe(token?: string) {
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return request(`/api/auth/me`, { method: "GET", headers });
}

export async function apiResetPassword(token: string, password: string) {
  return request(`/api/auth/reset`, { method: "POST", body: JSON.stringify({ token, password }) });
}

export default { apiRegister, apiLogin, apiMe, apiResetPassword };
