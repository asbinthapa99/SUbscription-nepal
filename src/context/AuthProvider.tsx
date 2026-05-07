"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authApi from "@/lib/api/auth";

type User = { id: string; name: string; email: string; role?: string } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "auth_token_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await authApi.apiMe();
        if (mounted) setUser(res.user || null);
      } catch (e) {
        if (mounted) setUser(null);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    const res = await authApi.apiLogin({ email, password });
    const t = res.token;
    setToken(t || null);
    setUser(res.user || null);
    setLoading(false);
    router.push("/dashboard");
  }

  async function register(name: string, email: string, password: string) {
    setLoading(true);
    const res = await authApi.apiRegister({ name, email, password });
    const t = res.token;
    setToken(t || null);
    setUser(res.user || null);
    setLoading(false);
    router.push("/dashboard");
  }

  function logout() {
    // Attempt to clear server cookie by calling logout endpoint
    fetch((process.env.NEXT_PUBLIC_API_URL || "") + "/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    setToken(null);
    setUser(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
