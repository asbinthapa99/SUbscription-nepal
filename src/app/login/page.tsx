"use client";

import React from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { useAuth } from "@/context/AuthProvider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-border/60">
      <CardHeader>
        <h1 className="font-heading font-extrabold text-3xl">Sign in</h1>
        <p className="text-sm text-muted-foreground">Access your FlowAI Nepal dashboard.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" autoComplete="email" className="mt-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input id="password" name="password" type="password" autoComplete="current-password" className="mt-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div role="alert" aria-live="assertive" className="text-sm text-destructive">{error}</div>}
          <div className="text-sm text-right mt-1"><Link href="/forgot-password" className="text-sm text-[#dc143c] hover:underline">Forgot password?</Link></div>
          <button type="submit" disabled={loading} className={cn(buttonVariants(), "w-full gradient-primary text-white")}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="text-sm text-muted-foreground mt-5 text-center">
          New here? <Link href="/register" className="font-medium text-[#dc143c] hover:underline">Create account</Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
        <LoginForm />
      </main>
    </>
  );
}
