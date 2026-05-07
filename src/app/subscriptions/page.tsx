import React, { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Search } from "lucide-react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { useProducts } from "@/context/ProductProvider";
import { categoryLabels } from "@/lib/subscriptions";
import { BrandLogo } from "@/components/ui/brand-logo";

const categoryList = [
  { key: "all", label: "All" },
  { key: "streaming", label: "Streaming" },
  { key: "ai", label: "AI Tools" },
  { key: "music", label: "Music" },
  { key: "productivity", label: "Productivity" },
  { key: "education", label: "Education" },
];

export default function SubscriptionsPage() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pb-16 md:pb-0" style={{ background: "#f8f9ff" }}>
        {/* Hero header */}
        <section className="pt-24 md:pt-32 pb-8 px-4 md:px-6 lg:px-8 text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(220,20,60,0.08) 0%, rgba(30,111,191,0.06) 50%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div className="relative max-w-3xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-4 md:mb-5"
              style={{
                background: "rgba(220,20,60,0.08)",
                border: "1px solid rgba(220,20,60,0.2)",
                color: "#dc143c",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c] animate-pulse" />
              All subscriptions
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 md:mb-4 text-balance px-1">
              Premium subscriptions in NPR
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto px-2 sm:px-0 mb-8">
              Browse Netflix, ChatGPT, Spotify and more. Pay in NPR. No dollar card needed.
            </p>

            {/* Search bar */}
            <div className="max-w-md mx-auto relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#dc143c] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for Netflix, ChatGPT, Spotify..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white bg-white/80 backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dc143c]/20 focus:border-[#dc143c] transition-all text-sm"
              />
            </div>
          </div>
        </section>

        {/* Category tabs */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-6 md:mb-8">
          <div className="flex items-center gap-2 flex-wrap md:flex-wrap overflow-x-auto md:overflow-visible pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {categoryList.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap"
                style={{
                  background: activeCategory === cat.key ? "#dc143c" : "rgba(255,255,255,0.9)",
                  color: activeCategory === cat.key ? "#fff" : "#64748b",
                  border: activeCategory === cat.key ? "1px solid #dc143c" : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: activeCategory === cat.key ? "0 4px 12px rgba(220,20,60,0.25)" : "none",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Subscription grid */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-20 md:pb-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-[#dc143c] animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">Loading premium catalog...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {filteredProducts.map((plan) => {
                const popularDuration = plan.durations.find((d) => d.popular) ?? plan.durations[0];

                return (
                  <div
                    key={plan.id}
                    className="group relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.95)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
                    }}
                  >
                    <div className="h-1 w-full flex-shrink-0" style={{ background: plan.accent }} />

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-4 gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{
                            background: `rgba(${plan.rgb},0.12)`,
                            border: `1px solid rgba(${plan.rgb},0.2)`,
                          }}
                        >
                          <BrandLogo name={plan.name} provider={plan.provider} className="w-5 h-5" />
                        </div>
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

                      <h3 className="font-heading font-bold text-lg text-foreground mb-0.5">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">by {plan.provider}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2 h-10">
                        {plan.description}
                      </p>

                      <ul className="space-y-2 mb-5 flex-1">
                        {plan.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-xs text-foreground/80">
                            <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.accent }} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {plan.durations.map((dur) => (
                          <span
                            key={dur.months}
                            className="text-[10px] px-2.5 py-1 rounded-lg font-bold border transition-colors whitespace-nowrap"
                            style={
                              dur.popular
                                ? { background: plan.accent, color: "#fff", border: `1px solid ${plan.accent}` }
                                : { background: `rgba(${plan.rgb},0.04)`, color: plan.accent, border: `1px solid rgba(${plan.rgb},0.15)` }
                            }
                          >
                            {dur.label} · Rs {dur.priceNpr.toLocaleString()}
                          </span>
                        ))}
                      </div>

                      <div className="mb-5 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground">Rs {popularDuration.priceNpr.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground font-medium">/ {popularDuration.label.toLowerCase()}</span>
                      </div>

                      <Link
                        href={`/subscriptions/${plan.slug}`}
                        className="relative w-full text-center py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 block"
                        style={{
                          background: `linear-gradient(135deg, ${plan.accent}, ${plan.accent}dd)`,
                          boxShadow: `0 4px 14px rgba(${plan.rgb},0.3)`,
                        }}
                      >
                        Select plan
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No subscriptions found</h3>
              <p className="text-slate-500 max-w-xs">We couldn&apos;t find any subscriptions matching &quot;{searchQuery}&quot; in this category.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-2 text-[#dc143c] font-bold text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}

      </main>
      <MarketingFooter />
    </>
  );
}
