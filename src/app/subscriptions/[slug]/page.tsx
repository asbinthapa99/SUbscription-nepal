"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowLeft, Shield, Clock, BadgeCheck, RotateCcw, Loader2 } from "lucide-react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { useProducts } from "@/context/ProductProvider";
import { BrandLogo } from "@/components/ui/brand-logo";

type Props = {
  params: { slug: string };
};

const trustPoints = [
  { icon: Clock, label: "Same-day delivery", desc: "Access delivered within 1–4 hours of payment" },
  { icon: BadgeCheck, label: "Genuine account", desc: "Real subscriptions, not cracked or fake" },
  { icon: Shield, label: "NPR payment", desc: "Pay via eSewa, Khalti, or IME Pay — no dollar card" },
  { icon: RotateCcw, label: "7-day guarantee", desc: "Replace or refund if anything goes wrong" },
];

export default function SubscriptionDetailPage({ params }: Props) {
  const { products, loading } = useProducts();
  const plan = products.find((s) => s.slug === params.slug);
  const [selectedDurationIndex, setSelectedDurationIndex] = useState(0);

  if (loading) {
    return (
      <>
        <MarketingNavbar />
        <main className="min-h-screen flex flex-col items-center justify-center py-20 gap-4" style={{ background: "#f8f9ff" }}>
          <Loader2 className="w-10 h-10 text-[#dc143c] animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Fetching product details...</p>
        </main>
        <MarketingFooter />
      </>
    );
  }

  if (!plan) {
    return (
      <>
        <MarketingNavbar />
        <main
          className="min-h-screen flex flex-col items-center justify-center text-center px-4"
          style={{ background: "#f8f9ff" }}
        >
          <h1 className="font-heading font-bold text-3xl text-foreground mb-3">
            Subscription not found
          </h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find that subscription in our catalog.
          </p>
          <Link
            href="/subscriptions"
            className="text-[#dc143c] font-semibold hover:underline"
          >
            ← Browse all subscriptions
          </Link>
        </main>
        <MarketingFooter />
      </>
    );
  }

  const selectedDuration = plan.durations[selectedDurationIndex] || plan.durations[0];

  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-28 pb-20 px-4 md:px-6 lg:px-8" style={{ background: "#f8f9ff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left column — info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Back link */}
              <Link
                href="/subscriptions"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All subscriptions
              </Link>

              {/* Header */}
              <div className="flex items-center gap-5">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `rgba(${plan.rgb},0.12)`,
                    border: `1.5px solid rgba(${plan.rgb},0.25)`,
                    boxShadow: `0 8px 24px rgba(${plan.rgb},0.15)`,
                  }}
                >
                   <BrandLogo name={plan.name} provider={plan.provider} className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-heading font-bold text-3xl text-foreground">{plan.name}</h1>
                    {plan.badge && (
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
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
                  <p className="text-sm text-muted-foreground">by {plan.provider}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-base text-muted-foreground leading-relaxed">{plan.description}</p>

              {/* Features */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <h2 className="font-heading font-bold text-lg text-foreground mb-4">What&apos;s included</h2>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `rgba(${plan.rgb},0.12)` }}
                      >
                        <Check className="w-3 h-3" style={{ color: plan.accent }} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why buy from us */}
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">Why buy from us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trustPoints.map((point) => {
                    const TrustIcon = point.icon;
                    return (
                      <div
                        key={point.label}
                        className="flex items-start gap-3 p-4 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.8)",
                          border: "1px solid rgba(255,255,255,0.9)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(220,20,60,0.08)" }}
                        >
                          <TrustIcon className="w-4 h-4 text-[#dc143c]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{point.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{point.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right column — sticky order card */}
            <div className="lg:col-span-1">
              <div
                className="sticky top-28 rounded-2xl p-6 space-y-5"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.98)",
                  boxShadow: `0 8px 32px rgba(${plan.rgb},0.12), 0 2px 8px rgba(0,0,0,0.06)`,
                }}
              >
                {/* Accent top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                  style={{ background: plan.accent }}
                />

                <h2 className="font-heading font-bold text-xl text-foreground">
                  Order {plan.name}
                </h2>

                {/* Duration selector */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Choose duration
                  </p>
                  {plan.durations.map((dur, idx) => (
                    <label
                      key={dur.months}
                      onClick={() => setSelectedDurationIndex(idx)}
                      className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-150"
                      style={{
                        border: selectedDurationIndex === idx
                          ? `2px solid ${plan.accent}`
                          : "1px solid rgba(0,0,0,0.08)",
                        background: selectedDurationIndex === idx
                          ? `rgba(${plan.rgb},0.08)`
                          : "rgba(255,255,255,0.6)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedDurationIndex === idx ? 'border-[#dc143c]' : 'border-slate-300'}`}>
                           {selectedDurationIndex === idx && <div className="w-2 h-2 rounded-full bg-[#dc143c]" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">{dur.label}</div>
                          {dur.popular && (
                            <span
                              className="text-[10px] font-bold uppercase tracking-wide"
                              style={{ color: plan.accent }}
                            >
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-foreground">
                          Rs {dur.priceNpr.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium">
                          Rs {Math.round(dur.priceNpr / dur.months).toLocaleString()}/mo
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Selected price display */}
                <div className="border-t border-black/[0.06] pt-4">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-black text-foreground">
                      Rs {selectedDuration.priceNpr.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      / {selectedDuration.label.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pay via eSewa, Khalti, or IME Pay
                  </p>
                </div>

                {/* Order button */}
                <Link
                  href={`/billing?plan=${plan.slug}&duration=${selectedDuration.months}mo`}
                  className="block w-full text-center py-4 rounded-xl text-sm font-bold text-white transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, #dc143c, #c41232)`,
                    boxShadow: "0 4px 14px rgba(220,20,60,0.35)",
                  }}
                >
                  Order now
                </Link>

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    { icon: Clock, label: "Fast Delivery" },
                    { icon: BadgeCheck, label: "Genuine" },
                    { icon: Shield, label: "Guarantee" },
                    { icon: RotateCcw, label: "Easy Renewal" },
                  ].map((badge) => {
                    const BadgeIcon = badge.icon;
                    return (
                      <div
                        key={badge.label}
                        className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium"
                      >
                        <BadgeIcon className="w-3 h-3 text-[#dc143c] flex-shrink-0" />
                        {badge.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
