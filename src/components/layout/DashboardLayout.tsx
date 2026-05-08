"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  Home,
  LogOut,
  ShieldCheck,
  MailWarning,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { apiFetch } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/billing", label: "Billing & Orders", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [verifyBanner, setVerifyBanner] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (user && !user.emailVerifiedAt) setVerifyBanner(true);
  }, [user]);

  async function handleResend() {
    try { await apiFetch("/api/auth/resend-verification", { method: "POST" }); setResendSent(true); } catch { /* ignore */ }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#dc143c] border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-64 bg-[#060b16] border-r border-white/[0.06] fixed left-0 top-0 h-full z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#dc143c]">Flow</span>
              <span className="text-white">AI</span>
            </span>
            <span className="text-slate-400 text-xs font-medium mt-0.5">Nepal</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#dc143c]/10 text-[#dc143c] border-l-2 border-[#dc143c] pl-[10px]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}

          <div className="my-3 border-t border-white/[0.06]" />

          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                pathname === "/admin"
                  ? "bg-[#dc143c]/10 text-[#dc143c] border-l-2 border-[#dc143c] pl-[10px]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              Admin
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all duration-150"
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            Back to Home
          </Link>
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#dc143c]/20 flex items-center justify-center text-[#dc143c] font-bold text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-medium truncate">{user.name}</div>
              <div className="text-slate-500 text-xs truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all duration-150"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-[#0a0f1e]/80 backdrop-blur-md border-b border-white/[0.06] px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 md:hidden">
            <span className="text-lg font-extrabold">
              <span className="text-[#dc143c]">Flow</span>
              <span className="text-white">AI</span>
            </span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#dc143c]/20 flex items-center justify-center text-[#dc143c] font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-white text-sm font-medium hidden sm:block">{user.name}</span>
          </div>
        </header>

        {/* Email verification banner */}
        {verifyBanner && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
              <MailWarning className="w-4 h-4 flex-shrink-0" />
              <span>Please verify your email address to secure your account.</span>
              {!resendSent ? (
                <button onClick={handleResend} className="underline underline-offset-2 font-bold hover:text-amber-300">Resend link</button>
              ) : <span className="font-bold text-emerald-400">Sent!</span>}
            </div>
            <button onClick={() => setVerifyBanner(false)} className="text-amber-400/60 hover:text-amber-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
