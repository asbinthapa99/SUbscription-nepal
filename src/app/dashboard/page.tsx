"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useProducts } from "@/context/ProductProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getUsageSummary, type UsageSummary } from "@/lib/api/usage";
import { getSubscription, type Subscription } from "@/lib/api/subscription";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  sub,
  loading = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl p-4 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] transition-colors min-h-[100px] flex flex-col justify-center">
      <div className="text-slate-400 text-[10px] font-medium uppercase tracking-widest mb-1">{label}</div>
      {loading ? (
        <div className="h-7 w-12 bg-white/10 animate-pulse rounded mb-1" />
      ) : (
        <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      )}
      {sub && <div className="text-slate-500 text-[10px] truncate">{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [usageRes, subRes] = await Promise.all([
          getUsageSummary(),
          getSubscription(),
        ]);
        setUsage(usageRes);
        setSubscription(subRes.subscription);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {getGreeting()}, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Manage your subscriptions and orders from here.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard 
          label="Daily Prompts" 
          value={usage?.usage.promptsToday ?? 0} 
          sub={usage?.limits ? `Limit: ${usage.limits.dailyPromptLimit}` : "No limit"} 
          loading={loading}
        />
        <StatCard 
          label="Next Renewal" 
          value={subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" }) : "—"} 
          sub={subscription ? `Status: ${subscription.status}` : "No active plans"} 
          loading={loading}
        />
        <StatCard 
          label="Token Usage" 
          value={usage?.usage.tokensThisMonth.toLocaleString() ?? 0} 
          sub="Tokens used this month" 
          loading={loading}
        />
        <StatCard 
          label="Active Plan" 
          value={subscription?.productSlug?.toUpperCase() || (subscription?.planType !== "FREE" ? subscription?.planType : "Free") || "Free"} 
          sub={subscription ? "Premium Access" : "Basic Access"} 
          loading={loading}
        />
      </div>

      {/* My active subscriptions */}
      <div className="mb-8">
        <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-50 mb-4">
          Current Access
        </h2>
        {loading ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#dc143c] animate-spin" />
          </div>
        ) : subscription ? (
          <div className="rounded-3xl border border-[#dc143c]/20 bg-[#dc143c]/05 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg shadow-[#dc143c]/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#dc143c]/20 flex items-center justify-center shadow-inner">
                <BrandLogo name={subscription.productSlug || "AI"} provider="" className="w-7 h-7" />
              </div>
              <div>
                <div className="text-white font-black text-xl">
                  {products.find(p => p.slug === subscription.productSlug)?.name || 
                   (subscription.productSlug ? subscription.productSlug.charAt(0).toUpperCase() + subscription.productSlug.slice(1) : subscription.planType)} Plan
                </div>
                <div className="text-slate-400 text-sm font-medium mt-0.5">
                  Valid until {new Date(subscription.expiresAt).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                {subscription.status}
              </span>
              <Link href="/billing" className="text-[#dc143c] text-xs font-black uppercase tracking-widest hover:underline">
                Manage Billing
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.04] p-10">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-1">
                <ShoppingBag className="w-8 h-8 text-slate-700" />
              </div>
              <div className="space-y-1">
                <div className="text-white font-black text-lg">No premium access found</div>
                <div className="text-slate-500 text-sm max-w-xs font-medium leading-relaxed">
                  Unlock GPT-4o, Netflix, or Midjourney instantly with a local NPR payment.
                </div>
              </div>
              <Link
                href="/subscriptions"
                className="mt-2 flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black text-white transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #dc143c, #c41232)",
                  boxShadow: "0 8px 20px rgba(220,20,60,0.35)",
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                EXPLORE CATALOG
              </Link>
            </div>
          </div>
        )}
      </div>


      {/* Browse catalog — featured plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
            Featured Subscriptions
          </h2>
          <Link
            href="/subscriptions"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {productsLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
             {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />)}
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredProducts.map((plan) => {
              const cheapestDuration = plan.durations.reduce((a, b) =>
                a.priceNpr < b.priceNpr ? a : b
              );

              return (
                <Link
                  key={plan.id}
                  href={`/subscriptions/${plan.slug}`}
                  className="group flex flex-col gap-4 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `rgba(${plan.rgb},0.15)`, border: `1px solid rgba(${plan.rgb},0.2)` }}
                    >
                       <BrandLogo name={plan.name} provider="" className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold text-sm truncate">{plan.name}</div>
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">by {plan.provider}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-slate-400 text-[10px] font-bold">
                      FROM RS {cheapestDuration.priceNpr.toLocaleString()}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                       <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Renewal reminder info */}
      <div className="mt-8 rounded-2xl border border-[#1e6fbf]/20 bg-[#1e6fbf]/05 p-5 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#1e6fbf]/10 flex items-center justify-center flex-shrink-0">
          <RotateCcw className="w-5 h-5 text-[#1e6fbf]" />
        </div>
        <div>
          <div className="text-white text-base font-bold mb-1">Renewal Reminders</div>
          <div className="text-slate-400 text-sm leading-relaxed">
            We notify you 3–5 days before your subscription expires via email so you never lose access unexpectedly.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

