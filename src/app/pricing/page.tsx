"use client";

import React from "react";
import Link from "next/link";
import { Check, Star, Loader2 } from "lucide-react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { useProducts } from "@/context/ProductProvider";
import { categoryLabels } from "@/lib/subscriptions";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function PricingPage() {
  const { products, loading } = useProducts();

  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-24 md:pt-28 pb-16 md:pb-20" style={{ background: "#f8f9ff" }}>
        {/* Header */}
        <section className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center mb-10 md:mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-4 md:mb-5"
            style={{
              background: "rgba(30,111,191,0.08)",
              border: "1px solid rgba(30,111,191,0.2)",
              color: "#1e6fbf",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e6fbf] animate-pulse" />
            Transparent pricing
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 md:mb-4 text-balance px-1">
            Subscription prices in NPR
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground px-2 sm:px-0">
            All prices are in Nepali Rupees. Pay via eSewa, Khalti, or IME Pay.
          </p>
        </section>

        {/* Subscription pricing cards */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-4 md:space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-[#dc143c] animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">Loading pricing table...</p>
            </div>
          ) : products.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              {/* Accent bar */}
              <div className="h-0.5 w-full" style={{ background: plan.accent }} />

              <div className="p-4 sm:p-5 md:p-6">
                {/* Plan header */}
                <div className="flex items-start justify-between gap-3 mb-5 md:mb-6 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{
                        background: `rgba(${plan.rgb},0.12)`,
                        border: `1px solid rgba(${plan.rgb},0.2)`,
                      }}
                    >
                      <BrandLogo name={plan.name} provider={plan.provider} className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground truncate max-w-[12rem] sm:max-w-none">
                          {plan.name}
                        </h2>
                        {plan.badge && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                            style={{
                              background: `rgba(${plan.rgb},0.12)`,
                              color: plan.accent,
                              border: `1px solid rgba(${plan.rgb},0.2)`,
                            }}
                          >
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {(categoryLabels as any)[plan.category] || plan.category} · by {plan.provider}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/subscriptions/${plan.slug}`}
                    className="flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-2xl text-sm font-semibold text-white transition-all duration-200 w-full sm:w-auto"
                    style={{
                      background: `linear-gradient(135deg, ${plan.accent}, ${plan.accent}dd)`,
                      boxShadow: `0 3px 10px rgba(${plan.rgb},0.3)`,
                    }}
                  >
                    Order
                  </Link>
                </div>

                {/* Pricing table */}
                <div className="grid gap-2 md:hidden">
                  {plan.durations.map((dur) => {
                    const perMonth = Math.round(dur.priceNpr / dur.months);
                    return (
                      <div
                        key={dur.months}
                        className="flex items-center justify-between gap-3 rounded-2xl border px-3 py-3"
                        style={{
                          background: dur.popular ? `rgba(${plan.rgb},0.05)` : "rgba(255,255,255,0.6)",
                          borderColor: dur.popular ? `rgba(${plan.rgb},0.18)` : "rgba(0,0,0,0.06)",
                        }}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm text-foreground">{dur.label}</p>
                            {dur.popular && (
                              <span
                                className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                                style={{ background: plan.accent, color: "#fff" }}
                              >
                                <Star className="w-2.5 h-2.5" />
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Rs {perMonth.toLocaleString()}/mo</p>
                        </div>
                        <p className="font-bold text-foreground whitespace-nowrap">Rs {dur.priceNpr.toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-black/[0.06]">
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">Duration</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">Price (NPR)</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">Per month</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.durations.map((dur, i) => {
                        const perMonth = Math.round(dur.priceNpr / dur.months);
                        const basePerMonth = Math.round(plan.durations[0].priceNpr / plan.durations[0].months);
                        const savings = Math.round(((basePerMonth - perMonth) / basePerMonth) * 100);

                        return (
                          <tr
                            key={dur.months}
                            className="border-b border-black/[0.04] last:border-0"
                            style={dur.popular ? { background: `rgba(${plan.rgb},0.04)` } : undefined}
                          >
                            <td className="py-3 pr-4 font-medium text-foreground">
                              <div className="flex items-center gap-2">
                                {dur.label}
                                {dur.popular && (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                                    style={{ background: plan.accent, color: "#fff" }}
                                  >
                                    <Star className="w-2.5 h-2.5" />
                                    Popular
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 pr-4 font-bold text-foreground">Rs {dur.priceNpr.toLocaleString()}</td>
                            <td className="py-3 pr-4 text-muted-foreground">Rs {perMonth.toLocaleString()}/mo</td>
                            <td className="py-3">
                              {i === 0 ? (
                                <span className="text-muted-foreground text-xs">Base price</span>
                              ) : savings > 0 ? (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>
                                  Save {savings}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Features mini-row */}
                <div className="flex flex-wrap gap-2.5 mt-4 pt-4 border-t border-black/[0.04]">
                  {plan.features.map((feature) => (
                    <span key={feature} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground rounded-full px-2.5 py-1 bg-white/40">
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.accent }} />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Footer note */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-8 md:mt-10 pb-4 md:pb-0">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Prices may change. We always notify before renewal.
            Have questions?{" "}
            <a href="mailto:support@flowainepal.com" className="text-[#dc143c] hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}

