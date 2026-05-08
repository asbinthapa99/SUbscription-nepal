"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authApi from "@/lib/api/auth";
import { apiFetch } from "@/lib/api/client";

type User = { id: string; name: string; email: string; role?: string; emailVerifiedAt?: string | null } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
    try {
      const res = await authApi.apiLogin({ email, password });
      setToken(res.token || null);
      setUser(res.user || null);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    setLoading(true);
    try {
      const res = await authApi.apiRegister({ name, email, password });
      setToken(res.token || null);
      setUser(res.user || null);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
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
