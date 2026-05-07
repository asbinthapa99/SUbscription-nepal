"use client";

import { useEffect, useRef, useState } from "react";
import { CreditCard, Clock, Package, ShieldCheck, CalendarDays, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Pay in NPR",
    description: "eSewa, Khalti, or IME Pay. No dollar card needed, no international transfer, no bank hassle.",
    color: "#dc143c",
    rgb: "220,20,60",
  },
  {
    icon: Clock,
    title: "Same-day delivery",
    description: "Pay and get access within hours of payment confirmation. No waiting days for activation.",
    color: "#1e6fbf",
    rgb: "30,111,191",
  },
  {
    icon: Package,
    title: "All major platforms",
    description: "Netflix, ChatGPT Plus, Claude Pro, Spotify, YouTube Premium, Canva, NordVPN and many more.",
    color: "#10b981",
    rgb: "16,185,129",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & verified",
    description: "2,000+ happy customers. Every subscription comes with a 7-day replacement guarantee.",
    color: "#f59e0b",
    rgb: "245,158,11",
  },
  {
    icon: CalendarDays,
    title: "Flexible durations",
    description: "Choose 1 month, 3 months, 6 months, or 1 year. Pick what works for your budget.",
    color: "#8b5cf6",
    rgb: "139,92,246",
  },
  {
    icon: HeadphonesIcon,
    title: "Local support",
    description: "Nepali-speaking support available on WhatsApp and Viber. We speak your language.",
    color: "#06b6d4",
    rgb: "6,182,212",
  },
];

function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: (typeof features)[0];
  index: number;
  inView: boolean;
}) {
  const Icon = feature.icon;
  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms, box-shadow 0.3s ease`,
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.95)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,1), inset 0 1px 0 rgba(255,255,255,1)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px -10px rgba(${feature.rgb},0.25), 0 0 0 1px rgba(${feature.rgb},0.3), inset 0 1px 0 rgba(255,255,255,0.9)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)";
      }}
    >
      {/* Hover gradient fill */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, rgba(${feature.rgb},0.08) 0%, transparent 60%)` }}
      />

      <div className="relative p-7">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `rgba(${feature.rgb},0.1)`,
            border: `1.5px solid rgba(${feature.rgb},0.2)`,
            boxShadow: `0 8px 24px rgba(${feature.rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.5)`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: feature.color }} />
        </div>

        <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-foreground transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }}
      />

      {/* Corner glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-400 pointer-events-none"
        style={{ background: `rgba(${feature.rgb},0.25)` }}
      />
    </div>
  );
}

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="features" className="py-16 md:py-32 relative overflow-hidden scroll-mt-24">
      {/* Section background with orbs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 100% 0%, rgba(220,20,60,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 0% 100%, rgba(30,111,191,0.1) 0%, transparent 60%),
              #f1f3f9
            `,
          }}
        />
        <div
          className="animate-aurora absolute -top-24 -right-24 w-[500px] h-[500px]"
          style={{
            background: "radial-gradient(circle, rgba(220,20,60,0.2) 0%, rgba(220,20,60,0.06) 45%, transparent 70%)",
            filter: "blur(60px)",
            animationDelay: "-5s",
          }}
        />
        <div
          className="animate-aurora absolute -bottom-24 -left-24 w-[500px] h-[500px]"
          style={{
            background: "radial-gradient(circle, rgba(30,111,191,0.18) 0%, rgba(30,111,191,0.05) 45%, transparent 70%)",
            filter: "blur(60px)",
            animationDelay: "-12s",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: "rgba(220,20,60,0.08)",
              border: "1px solid rgba(220,20,60,0.2)",
              color: "#dc143c",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c] animate-pulse" />
            Why choose us
          </div>
          <h2
            className="font-heading font-bold text-2xl sm:text-3xl md:text-5xl text-foreground mb-5 text-balance px-1"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            The easiest way to get{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #dc143c, #ff4d6d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              premium subscriptions
            </span>
          </h2>
          <p
            className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto text-balance px-2 sm:px-0"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            No dollar card. No international payments. Just pay in NPR and get access today.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
