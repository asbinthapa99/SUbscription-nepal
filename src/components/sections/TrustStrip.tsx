"use client";

import { CreditCard, Gauge, LockKeyhole, MapPin } from "lucide-react";
import { trustItems } from "@/lib/home";

const icons = [CreditCard, Gauge, LockKeyhole, MapPin];
const colors = ["#f87171", "#60a5fa", "#c084fc", "#34d399"];
const rgbs = ["248,113,113", "96,165,250", "192,132,252", "52,211,153"];

export function TrustStrip() {
  return (
    <>
      {/* Dark → light gradient bridge so the hero flows into the white sections */}
      <div
        className="relative z-10 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #030712 0%, #f8f9ff 100%)",
        }}
      />

      {/* Trust strip — sits in the light zone */}
      <section className="relative z-10 -mt-6 px-4 md:px-6 lg:px-8">
        <div
          className="max-w-7xl mx-auto rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 24px 60px -12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, index) => {
              const Icon = icons[index];
              const color = colors[index];
              const rgb = rgbs[index];
              return (
                <div
                  key={item.label}
                  className="group flex items-center gap-4 p-5 md:p-6 transition-all duration-200 relative"
                  style={{
                    borderRight: index % 2 === 0 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    borderBottom: index < 2 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `rgba(${rgb},0.1)`,
                      border: `1.5px solid rgba(${rgb},0.2)`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-sm text-foreground truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
