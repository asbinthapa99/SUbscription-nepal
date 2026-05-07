"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-4xl shadow-[0_24px_80px_rgba(2,6,23,0.55)] border border-white/6"
          style={{ minHeight: "460px" }}
        >
          {/* Aurora gradient background */}
          <div className="absolute inset-0 gradient-hero" />
          {/* Vignette + subtle grid */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 80%)',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />

          {/* Animated orbs inside CTA */}
          <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="animate-aurora absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div
              className="animate-aurora absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
                filter: "blur(40px)",
                animationDelay: "-10s",
              }}
            />
            <div
              className="animate-aurora absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(255,107,107,0.15) 0%, transparent 70%)",
                filter: "blur(60px)",
                animationDelay: "-5s",
              }}
            />

            {/* Noise/grain texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Floating glass shapes */}
            <div
              className="animate-float absolute top-8 left-16 w-16 h-16 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                animationDelay: "-2s",
              }}
            />
            <div
              className="animate-float-alt absolute bottom-10 left-32 w-10 h-10 rounded-full"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                animationDelay: "-4s",
              }}
            />
            <div
              className="animate-float absolute top-12 right-24 w-12 h-12 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                animationDelay: "-1s",
              }}
            />
            <div
              className="animate-float-alt absolute bottom-8 right-16 w-8 h-8 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                animationDelay: "-3s",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28">
            {/* Flag badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white/90 mb-6"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span>🇳🇵</span>
              Made for Nepal
            </div>

            <h2 className="font-heading font-extrabold text-4xl md:text-7xl text-white mb-6 text-balance leading-[1.02] tracking-tight">
              Get your subscription today
            </h2>
            <p className="text-white/70 text-xl max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
              Join thousands of Nepali students, developers, and freelancers who pay for Netflix, ChatGPT, and more in NPR. No dollar card needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/subscriptions"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "relative bg-white text-[#dc143c] hover:bg-white/95 font-bold h-13 px-9 rounded-full shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden group"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Browse subscriptions
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-[#dc143c]/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              </Link>
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-13 px-9 rounded-full text-white font-semibold bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/12 hover:scale-105"
                )}
              >
                View prices
              </Link>
            </div>

            {/* Social proof */}
            <p className="mt-8 text-sm text-white/50">
              <span className="text-white/80 font-semibold">2,000+</span> subscribers · No dollar card required · Same-day delivery
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
