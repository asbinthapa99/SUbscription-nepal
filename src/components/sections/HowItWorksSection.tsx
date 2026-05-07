"use client";

import { useEffect, useRef, useState } from "react";
import { Search, CreditCard, Zap } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Search,
    title: "Choose your subscription",
    description: "Browse Netflix, ChatGPT, Spotify and more. Pick your platform and duration — 1 month, 3 months, or longer.",
    color: "#dc143c",
    rgb: "220,20,60",
  },
  {
    step: 2,
    icon: CreditCard,
    title: "Pay in NPR",
    description: "Pay instantly with eSewa, Khalti, or IME Pay. No dollar card, no bank hassle, no conversion fees.",
    color: "#1e6fbf",
    rgb: "30,111,191",
  },
  {
    step: 3,
    icon: Zap,
    title: "Get instant access",
    description: "We deliver your subscription credentials or invite within hours. Start streaming or using AI immediately.",
    color: "#10b981",
    rgb: "16,185,129",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "#f8f9ff" }} />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "rgba(30,111,191,0.08)", border: "1px solid rgba(30,111,191,0.2)", color: "#1e6fbf" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e6fbf] animate-pulse" />
            How it works
          </div>
          <h2
            className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4 text-balance"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}
          >
            Get your subscription in{" "}
            <span style={{ background: "linear-gradient(135deg, #1e6fbf, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              3 steps
            </span>
          </h2>
          <p className="text-muted-foreground text-lg" style={{ opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 0.15s" }}>
            No international card. No VPN. No complicated setup.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="group flex flex-col items-center text-center"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(32px)",
                  transition: `all 0.6s ease ${i * 150 + 200}ms`,
                }}
              >
                {/* Step number + connector line */}
                <div className="flex items-center w-full mb-8">
                  {/* Left line */}
                  {i > 0 && (
                    <div
                      className="flex-1 h-px"
                      style={{
                        background: `linear-gradient(90deg, rgba(${steps[i - 1].rgb},0.3), rgba(${step.rgb},0.3))`,
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.6s ease ${i * 150 + 400}ms`,
                      }}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-heading font-black text-xl text-white shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`,
                      boxShadow: `0 8px 24px rgba(${step.rgb},0.35)`,
                    }}
                  >
                    {step.step}
                  </div>

                  {/* Right line */}
                  {i < steps.length - 1 && (
                    <div
                      className="flex-1 h-px"
                      style={{
                        background: `linear-gradient(90deg, rgba(${step.rgb},0.3), rgba(${steps[i + 1].rgb},0.3))`,
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.6s ease ${i * 150 + 400}ms`,
                      }}
                    />
                  )}
                </div>

                {/* Card */}
                <div
                  className="w-full rounded-2xl p-7 transition-all duration-300 group-hover:-translate-y-2"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px rgba(${step.rgb},0.15), 0 0 0 1.5px rgba(${step.rgb},0.2)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `rgba(${step.rgb},0.08)`,
                      border: `1.5px solid rgba(${step.rgb},0.18)`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                  {/* Bottom bar */}
                  <div
                    className="mt-6 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full mx-auto"
                    style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p
          className="text-center text-sm text-muted-foreground mt-12"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 0.8s" }}
        >
          ✓ Same-day delivery &nbsp;·&nbsp; ✓ 7-day replacement guarantee &nbsp;·&nbsp; ✓ Nepali support
        </p>
      </div>
    </section>
  );
}
