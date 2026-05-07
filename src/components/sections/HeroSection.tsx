"use client";

import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chips = [
  "Netflix in NPR",
  "ChatGPT Plus",
  "Claude Pro",
  "Spotify Premium",
  "Pay via eSewa / Khalti",
  "No dollar card needed",
];

const platforms = [
  { name: "Netflix", color: "#e50914" },
  { name: "ChatGPT", color: "#10a37f" },
  { name: "Claude", color: "#d4733a" },
  { name: "Spotify", color: "#1db954" },
  { name: "YouTube", color: "#ff0000" },
  { name: "Canva", color: "#8b3dff" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 px-4">

      {/* Background */}
      <div className="absolute inset-0" style={{ background: "#05050f" }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute"
          style={{
            inset: 0,
            background: `
              radial-gradient(ellipse 65% 55% at 10% 15%, rgba(220,20,60,0.22) 0%, transparent 60%),
              radial-gradient(ellipse 55% 45% at 85% 10%, rgba(30,111,191,0.18) 0%, transparent 60%),
              radial-gradient(ellipse 45% 40% at 50% 95%, rgba(139,92,246,0.14) 0%, transparent 60%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-6">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(220,20,60,0.12)", border: "1px solid rgba(220,20,60,0.3)", color: "#fca5a5" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c] animate-pulse" />
          🇳🇵 Nepal&apos;s #1 Subscription Reseller
        </div>

        {/* Headline */}
        <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white text-balance">
          Netflix, ChatGPT &amp; More
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #ff4d6d 0%, #dc143c 40%, #ff6b35 70%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Billed in Nepali Rupees.
          </span>
        </h1>

        {/* Sub */}
        <p className="text-base md:text-lg text-slate-400 max-w-xl text-balance leading-relaxed">
          We buy international subscriptions and resell them to Nepali customers in{" "}
          <strong className="text-white">NPR</strong> — no dollar card, no VPN, no hassle.
          Order in minutes, delivered same day.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Link
            href="/subscriptions"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gradient-primary text-white font-bold h-12 px-8 rounded-xl group overflow-hidden relative",
            )}
            style={{ boxShadow: "0 0 32px rgba(220,20,60,0.4), 0 4px 16px rgba(220,20,60,0.25)" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Browse subscriptions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          </Link>
          <Link
            href="/pricing"
            className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 rounded-xl font-semibold text-white")}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)" }}
          >
            View prices in NPR
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span><span className="text-slate-300 font-semibold">2,000+</span> Nepalis already subscribed · Trusted reseller</span>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-400"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <Check className="w-3 h-3 text-[#34d399]" />
              {chip}
            </span>
          ))}
        </div>

        {/* Platform badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs text-slate-600 mr-1">Available:</span>
          {platforms.map((p) => (
            <span
              key={p.name}
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: `${p.color}18`, border: `1px solid ${p.color}35`, color: p.color }}
            >
              {p.name}
            </span>
          ))}
          <span className="text-xs text-slate-600">+ more</span>
        </div>
      </div>
    </section>
  );
}
