"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { publicPricingPlans } from "@/lib/plans";
import { cn, formatNPR } from "@/lib/utils";
import type { BillingPeriod } from "@/types/plan";

export function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="pricing" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 25% -10%, rgba(220,20,60,0.13) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 75% 110%, rgba(139,92,246,0.12) 0%, transparent 60%),
              #f1f3f9
            `,
          }}
        />
        <div
          className="animate-aurora absolute -top-32 left-1/4 w-[500px] h-[500px]"
          style={{
            background: "radial-gradient(circle, rgba(220,20,60,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
            animationDelay: "-8s",
          }}
        />
        <div
          className="animate-aurora absolute bottom-0 right-1/4 w-[400px] h-[400px]"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)",
            filter: "blur(60px)",
            animationDelay: "-3s",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: "rgba(220,20,60,0.08)",
              border: "1px solid rgba(220,20,60,0.2)",
              color: "#dc143c",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c] animate-pulse" />
            Pricing
          </div>
          <h2
            className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-5 text-balance"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            Simple pricing in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #dc143c, #ff4d6d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NPR
            </span>
          </h2>
          <p
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-8"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 0.6s ease 0.1s",
            }}
          >
            No hidden charges. Pay with eSewa, Khalti, or IME Pay.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex items-center gap-1 p-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                billing === "monthly"
                  ? "bg-[#dc143c] text-white shadow-lg shadow-[#dc143c]/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2",
                billing === "yearly"
                  ? "bg-[#dc143c] text-white shadow-lg shadow-[#dc143c]/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
          {publicPricingPlans.map((plan, index) => {
            const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <div
                key={plan.name}
                className="relative"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView
                    ? plan.featured ? "translateY(-8px)" : "translateY(0)"
                    : "translateY(40px)",
                  transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
                }}
              >
                {/* Animated gradient border wrapper for featured */}
                {plan.featured ? (
                  <div
                    className="p-[2px] rounded-[20px] relative"
                    style={{
                      background: "conic-gradient(from var(--border-angle), #dc143c, #ff6b6b, #8b5cf6, #1e6fbf, #10b981, #dc143c)",
                      animation: "borderSpin 4s linear infinite",
                      boxShadow: "0 0 40px rgba(220,20,60,0.3), 0 0 80px rgba(139,92,246,0.15)",
                    }}
                  >
                    <PricingCard plan={plan} price={price} billing={billing} featured />
                  </div>
                ) : (
                  <PricingCard plan={plan} price={price} billing={billing} featured={false} />
                )}
              </div>
            );
          })}
        </div>

        {/* Payment methods */}
        <div className="text-center mt-14">
          <p className="text-sm text-muted-foreground mb-4">Accepted payment methods</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { name: "eSewa", color: "#60BB46", bg: "rgba(96,187,70,0.1)", border: "rgba(96,187,70,0.25)" },
              { name: "Khalti", color: "#5C2D91", bg: "rgba(92,45,145,0.1)", border: "rgba(92,45,145,0.25)" },
              { name: "IME Pay", color: "#E30613", bg: "rgba(227,6,19,0.1)", border: "rgba(227,6,19,0.25)" },
            ].map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  color: m.color,
                  background: m.bg,
                  border: `1px solid ${m.border}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                {m.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  plan,
  price,
  billing,
  featured,
}: {
  plan: (typeof publicPricingPlans)[0];
  price: number;
  billing: BillingPeriod;
  featured: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[18px] overflow-hidden transition-all duration-300",
        !featured && "hover:-translate-y-1"
      )}
      style={{
        background: featured
          ? "rgba(15,23,42,0.97)"
          : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: featured ? "none" : "1px solid rgba(255,255,255,0.95)",
        boxShadow: featured
          ? "none"
          : "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute top-4 right-4">
          <Badge className="gradient-primary text-white text-[10px] px-2.5 py-1 gap-1 rounded-full shadow-lg shadow-[#dc143c]/30">
            <Star className="w-2.5 h-2.5" />
            {plan.badge}
          </Badge>
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            {featured && (
              <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center shadow-md shadow-[#dc143c]/30">
                <Zap className="w-3 h-3 text-white" />
              </div>
            )}
            <h3 className={cn("font-heading font-bold text-xl", featured ? "text-white" : "text-foreground")}>
              {plan.name}
            </h3>
          </div>
          <p className={cn("text-sm", featured ? "text-slate-400" : "text-muted-foreground")}>{plan.description}</p>

          <div className="mt-5 pb-5 border-b" style={{ borderColor: featured ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}>
            {price === 0 ? (
              <div className="flex items-baseline gap-1">
                <span className={cn("text-4xl font-heading font-extrabold", featured ? "text-white" : "text-foreground")}>Free</span>
                <span className={cn("text-sm", featured ? "text-slate-400" : "text-muted-foreground")}>forever</span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className={cn("text-3xl font-heading font-extrabold", featured ? "text-white" : "text-foreground")}>
                    {formatNPR(price)}
                  </span>
                  <span className={cn("text-sm", featured ? "text-slate-400" : "text-muted-foreground")}>/mo</span>
                </div>
                {billing === "yearly" && (
                  <p className="text-xs text-[#10b981] mt-1 font-medium">
                    Billed {formatNPR(price * 12)}/year
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 flex-1 mb-8">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: featured ? "rgba(220,20,60,0.2)" : "rgba(16,185,129,0.12)" }}
              >
                <Check className="w-3 h-3" style={{ color: featured ? "#ff6b6b" : "#10b981" }} />
              </div>
              <span className={featured ? "text-slate-300" : "text-foreground/85"}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={plan.href}
          className={cn(
            "w-full flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-all duration-300",
            featured
              ? "gradient-primary text-white shadow-xl shadow-[#dc143c]/30 hover:shadow-[#dc143c]/50 hover:scale-[1.02]"
              : "border text-foreground hover:border-[#dc143c]/40 hover:bg-[#dc143c]/5"
          )}
          style={{
            borderColor: featured ? "transparent" : "rgba(0,0,0,0.1)",
          }}
        >
          {plan.cta}
          {featured && <Zap className="w-3.5 h-3.5" />}
        </Link>
      </div>
    </div>
  );
}
