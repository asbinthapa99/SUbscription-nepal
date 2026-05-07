"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { featuredSubscriptions } from "@/lib/subscriptions";
import { cn } from "@/lib/utils";

export function ServicesPreviewSection() {
  return (
    <section className="py-16 md:py-32 relative overflow-hidden scroll-mt-24">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)" }} />
        <div
          className="animate-aurora absolute -top-20 -right-20 w-[500px] h-[400px]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
              style={{ background: "rgba(220,20,60,0.08)", border: "1px solid rgba(220,20,60,0.2)", color: "#dc143c" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c] animate-pulse" />
              What we sell
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground text-balance leading-tight">
              Premium subscriptions,{" "}
              <span style={{ background: "linear-gradient(135deg, #dc143c, #ff4d6d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                priced for Nepal.
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg mt-4 leading-relaxed">
              Pay in NPR via eSewa, Khalti, or IME Pay. No dollar card needed.
            </p>
          </div>
          <Link
            href="/subscriptions"
            className={cn(buttonVariants({ variant: "outline" }), "shrink-0 gap-2 rounded-xl font-semibold hover:border-[#dc143c]/40 hover:text-[#dc143c] transition-colors w-full md:w-auto justify-center")}
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featuredSubscriptions.map((s) => {
            const Icon = s.icon;
            const minPrice = Math.min(...s.durations.map((d) => Math.round(d.priceNpr / d.months)));
            return (
              <Link
                key={s.id}
                href={`/subscriptions/${s.slug}`}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 60px rgba(${s.rgb},0.2), 0 0 0 1.5px rgba(${s.rgb},0.3)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
                }}
              >
                <div className="h-1 w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 100%, rgba(${s.rgb},0.05) 0%, transparent 60%)` }}
                />

                <div className="relative p-5 md:p-6">
                  {/* Icon + provider badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: `rgba(${s.rgb},0.1)`,
                        border: `1.5px solid rgba(${s.rgb},0.2)`,
                        boxShadow: `0 4px 16px rgba(${s.rgb},0.15)`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: s.accent }} />
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{ background: `rgba(${s.rgb},0.08)`, color: s.accent, border: `1px solid rgba(${s.rgb},0.2)` }}
                    >
                      by {s.provider}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{s.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Starting from</p>
                      <p className="font-heading font-extrabold text-xl text-foreground">
                        Rs {minPrice}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
                      </p>
                    </div>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `rgba(${s.rgb},0.1)`,
                        border: `1.5px solid rgba(${s.rgb},0.25)`,
                        boxShadow: `0 4px 16px rgba(${s.rgb},0.15)`,
                      }}
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" style={{ color: s.accent }} />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: s.accent }} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
