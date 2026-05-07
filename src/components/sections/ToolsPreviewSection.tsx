"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { aiTools } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function ToolsPreviewSection() {
  return (
    <section className="py-16 md:py-28 relative overflow-hidden scroll-mt-24">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #f1f3f9 0%, #f8f9ff 100%)" }} />
        <div
          className="animate-aurora absolute -bottom-20 right-0 w-[400px] h-[400px]"
          style={{ background: "radial-gradient(circle, rgba(30,111,191,0.1) 0%, transparent 70%)", filter: "blur(60px)", animationDelay: "-6s" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-8 md:gap-12 items-start">
          <div className="lg:sticky lg:top-28">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
              style={{ background: "rgba(30,111,191,0.08)", border: "1px solid rgba(30,111,191,0.2)", color: "#1e6fbf" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e6fbf] animate-pulse" />
              Included tools
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground text-balance leading-tight">
              Every AI tool you need,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #1e6fbf, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                in one place.
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg mt-4 leading-relaxed">
              Access GPT-4o, Claude, and more from a single dashboard — no juggling multiple subscriptions or API keys.
            </p>
            <Link
              href="/tools"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-7 h-12 px-7 rounded-xl font-semibold gap-2 group w-full sm:w-auto justify-center",
              )}
              style={{
                background: "linear-gradient(135deg, #1e6fbf, #1e40af)",
                color: "white",
                boxShadow: "0 0 24px rgba(30,111,191,0.3)",
              }}
            >
              Explore all tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  href={tool.href}
                  key={tool.id}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px ${tool.accent}55, inset 0 1px 0 rgba(255,255,255,0.9)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)";
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, ${tool.accent}, transparent)` }}
                  />

                  <div className="relative p-6">
                    <div
                      className="h-12 w-12 rounded-xl border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${tool.accent}14`,
                        borderColor: `${tool.accent}28`,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: tool.accent }} />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                  </div>

                  {/* Bottom bar */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${tool.accent}, transparent)` }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
