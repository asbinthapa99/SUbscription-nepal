"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, CreditCard, Settings, ArrowRight, User as UserIcon, Shield, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthProvider";
import { getSubscription, type Subscription } from "@/lib/api/subscription";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function ProfilePage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscription()
      .then(res => setSubscription(res.subscription))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  const quickLinks = [
    { href: "/chat", icon: MessageSquare, label: "AI Assistant", desc: "Start a new conversation", color: "#1e6fbf" },
    { href: "/billing", icon: CreditCard, label: "Billing & Orders", desc: "Manage your purchases", color: "#dc143c" },
    { href: "/settings", icon: Settings, label: "Account Settings", desc: "Update your preferences", color: "#64748b" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Your Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your identity and subscription status.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          {/* Sidebar / Identity */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 text-center flex flex-col items-center shadow-sm">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#dc143c] to-[#1e6fbf] p-0.5 shadow-xl shadow-black/20 mb-5">
                 <div className="w-full h-full rounded-[22px] bg-[#0d1526] flex items-center justify-center text-white font-black text-3xl">
                    {initials}
                 </div>
              </div>
              <h2 className="text-xl font-black text-white mb-1">{user.name}</h2>
              <p className="text-slate-500 text-sm font-medium mb-4">{user.email}</p>
              
              <div className="flex items-center gap-2">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                   subscription ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-white/10"
                 }`}>
                   {subscription ? (subscription.productSlug || subscription.planType) : "Basic"} Plan
                 </span>
                 {user.role === "ADMIN" && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#dc143c]/10 text-[#dc143c] border border-[#dc143c]/20 uppercase tracking-widest">
                       Admin
                    </span>
                 )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 space-y-4">
               <h3 className="text-white font-black text-xs uppercase tracking-widest opacity-50">Account Summary</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-slate-500 text-xs font-bold">MEMBER SINCE</span>
                     <span className="text-white text-xs font-black uppercase">{new Date().toLocaleDateString("en-NP", { month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-slate-500 text-xs font-bold">SECURE STATUS</span>
                     <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-black uppercase">
                        <Shield className="w-3 h-3" />
                        Verified
                     </span>
                  </div>
               </div>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-sm">
              <h3 className="text-white font-black text-xs uppercase tracking-widest opacity-50 mb-6">Active Access</h3>
              
              {loading ? (
                <div className="h-24 rounded-2xl bg-white/[0.05] animate-pulse flex items-center justify-center">
                   <Loader2 className="w-6 h-6 text-slate-700 animate-spin" />
                </div>
              ) : subscription ? (
                <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#dc143c]/20 flex items-center justify-center flex-shrink-0">
                      <BrandLogo name={subscription.productSlug || "AI"} provider="" className="w-7 h-7" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-black text-lg leading-tight truncate">
                        {subscription.productSlug ? subscription.productSlug.charAt(0).toUpperCase() + subscription.productSlug.slice(1) : subscription.planType} Plan
                      </div>
                      <div className="text-slate-400 text-xs font-medium mt-1">
                        Renews on {new Date(subscription.expiresAt).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-3 py-1 rounded-full font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                    {subscription.status}
                  </span>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-8 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-700">
                    <CreditCard className="w-8 h-8 opacity-20" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">No active subscription</div>
                    <p className="text-slate-500 text-xs mt-1 max-w-[240px] mx-auto">You are currently using the free version with basic limits.</p>
                  </div>
                  <Link href="/subscriptions" className="mt-2 text-[#dc143c] font-black text-xs uppercase tracking-widest hover:underline">
                    Upgrade Now — RS 499+
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-black text-xs uppercase tracking-widest opacity-50 px-2">Settings & Tools</h3>
              <div className="grid gap-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-5 p-5 rounded-3xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${link.color}15` }}>
                        <Icon className="w-5 h-5" style={{ color: link.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-black text-base">{link.label}</div>
                        <div className="text-slate-500 text-xs font-medium mt-0.5">{link.desc}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                         <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

