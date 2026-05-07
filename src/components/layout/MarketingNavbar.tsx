"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { Zap, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#features", label: "Why us" },
  { href: "/#how-it-works", label: "How it works" },
];

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { user, logout } = useAuth();

  function AuthActions({ mobile }: { mobile?: boolean }) {
    const [open, setOpen] = useState(false);
    if (user) {
      if (mobile) {
        return (
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-foreground">{user.name}</div>
            <Link href="/profile" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full text-left")}>Profile</Link>
            <Link href="/billing" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full text-left")}>Billing</Link>
            <Link href="/settings" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full text-left")}>Settings</Link>
            <button onClick={() => logout()} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full mt-2")}>Log out</button>
          </div>
        );
      }

      return (
        <div className="relative">
          <button onClick={() => setOpen(v => !v)} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-3")}>{user.name}</button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-popover border border-border shadow-lg py-2">
              <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted">Profile</Link>
              <Link href="/billing" className="block px-4 py-2 text-sm hover:bg-muted">Billing</Link>
              <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-muted">Settings</Link>
              <hr className="my-1" />
              <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm hover:bg-muted">Log out</button>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-foreground font-medium")}>Sign in</Link>
        <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "relative gradient-primary text-white font-semibold px-5 shadow-lg shadow-[#dc143c]/25 hover:shadow-[#dc143c]/40 hover:scale-105 transition-all duration-200 overflow-hidden group")}>
          <span className="relative z-10 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />Get started free</span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
        </Link>
      </>
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        "hidden md:block",
        scrolled
          ? "py-2"
          : "py-3"
      )}
    >
      {/* Glass pill container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 md:px-6 transition-all duration-500",
            scrolled
              ? "h-14 bg-background/80 backdrop-blur-xl border border-border/60 shadow-lg shadow-black/5"
              : "h-16 bg-transparent"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading font-bold text-xl group"
          >
            <div className="relative w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-[#dc143c]/30 group-hover:shadow-[#dc143c]/50 transition-shadow duration-300">
              <Zap className="w-4.5 h-4.5 text-white" />
              <div className="absolute inset-0 rounded-xl gradient-primary opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
            </div>
            <span className="text-foreground tracking-tight">
              Flow<span className="text-[#dc143c]">AI</span> Nepal
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                  activeLink === link.href
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#dc143c] rounded-full group-hover:w-4 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="flex items-center gap-2">
            <AuthActions />
          </div>
        </div>
      </div>
    </header>
  );
}
