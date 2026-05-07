"use client";

import Link from "next/link";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthProvider";
import React from "react";

function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser(name, email, password);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally { setLoading(false); }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-border/60">
      <CardHeader>
        <h1 className="font-heading font-extrabold text-3xl">Create account</h1>
        <p className="text-sm text-muted-foreground">Start free, then upgrade when you need more usage.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">Full name</label>
            <Input id="name" name="name" autoComplete="name" className="mt-2" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" name="email" type="email" autoComplete="email" className="mt-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input id="password" name="password" type="password" autoComplete="new-password" className="mt-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div role="alert" aria-live="assertive" className="text-sm text-destructive">{error}</div>}
          <div className="text-sm text-muted-foreground">Password must be at least 8 characters.</div>
          <button type="submit" disabled={loading} className={cn(buttonVariants(), "w-full gradient-primary text-white")}>{loading ? "Creating..." : "Create account"}</button>
        </form>
        <p className="text-sm text-muted-foreground mt-5 text-center">Already have an account? <Link href="/login" className="font-medium text-[#dc143c] hover:underline">Sign in</Link></p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
        <RegisterForm />
      </main>
    </>
  );
}
