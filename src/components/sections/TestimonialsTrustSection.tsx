"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/home";

const stats = [
  { value: "2,000+", label: "Active users" },
  { value: "NPR", label: "Payments only" },
  { value: "3", label: "AI providers" },
  { value: "7-day", label: "Money-back" },
];

export function TestimonialsTrustSection() {
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
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 0% 50%, rgba(220,20,60,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 100% 50%, rgba(30,111,191,0.07) 0%, transparent 60%),
              #f8f9ff
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#d97706",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
            Testimonials
          </div>
          <h2
            className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4 text-balance"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(20px)",
              transition: "all 0.6s ease",
            }}
          >
            Loved by Nepali{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #dc143c, #ff4d6d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              developers & students
            </span>
          </h2>
          <p
            className="text-muted-foreground text-lg max-w-xl mx-auto"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 0.6s ease 0.1s",
            }}
          >
            Real people saving real money on AI access — billed in NPR.
          </p>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(16px)",
            transition: "all 0.6s ease 0.15s",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center py-6 px-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              <p className="font-heading font-black text-3xl text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="relative flex flex-col p-7 rounded-2xl"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(28px)",
                transition: `all 0.6s ease ${i * 100 + 250}ms`,
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              {/* Quote icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 shrink-0"
                style={{
                  background: "rgba(220,20,60,0.08)",
                  border: "1.5px solid rgba(220,20,60,0.15)",
                }}
              >
                <Quote className="w-4 h-4 text-[#dc143c]" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>

              <blockquote className="text-foreground/85 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-sm text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #dc143c, #9f1239)" }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
