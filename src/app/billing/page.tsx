"use client";

import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  ReceiptText,
  Shield,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useProducts } from "@/context/ProductProvider";
import {
  getBillingOverview,
  initiatePayment,
  type BillingOverview,
  type InitiatePaymentCheckout,
} from "@/lib/api/subscription";
import { BrandLogo } from "@/components/ui/brand-logo";

type PaymentProvider = "esewa" | "khalti" | "imepay";

const PROVIDER_INFO: Record<PaymentProvider, { label: string; color: string; bg: string; note: string }> = {
  esewa: { label: "eSewa", color: "#60b246", bg: "#60b24620", note: "Wallet checkout" },
  khalti: { label: "Khalti", color: "#5c2d91", bg: "#5c2d9120", note: "Wallet checkout" },
  imepay: { label: "IME Pay", color: "#e84a4a", bg: "#e84a4a20", note: "Manual verify" },
};

export default function BillingPage() {
  const { products, loading: productsLoading } = useProducts();
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [initiating, setInitiating] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);
  const [checkout, setCheckout] = useState<InitiatePaymentCheckout | null>(null);

  useEffect(() => {
    let mounted = true;
    getBillingOverview()
      .then((res) => { if (mounted) setOverview(res); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingData(false); });
    return () => { mounted = false; };
  }, []);

  const selectedPlan = products.find((p) => p.slug === selectedSlug);
  const selectedDuration = selectedPlan?.durations.find((d) => d.months === selectedMonths);

  function productLabel(slug: string | null, months: number): string {
    if (!slug) return "Subscription";
    const plan = products.find((p) => p.slug === slug);
    const name = plan?.name ?? slug;
    return `${name} — ${months} month${months > 1 ? "s" : ""}`;
  }

  function selectProduct(slug: string) {
    if (selectedSlug === slug) {
      setSelectedSlug(null);
      setSelectedMonths(null);
    } else {
      setSelectedSlug(slug);
      const plan = products.find((p) => p.slug === slug);
      const popularDur = plan?.durations.find((d) => d.popular) ?? plan?.durations[0];
      setSelectedMonths(popularDur?.months ?? null);
    }
    setSelectedProvider(null);
    setPaymentResult(null);
    setCheckout(null);
  }

  async function handleConfirmPayment() {
    if (!selectedSlug || !selectedMonths || !selectedProvider) return;
    setInitiating(true);
    try {
      const result = await initiatePayment(selectedSlug, selectedMonths, selectedProvider);
      setCheckout(result.checkout);
      setPaymentResult({ success: true, message: result.checkout.message });
      setOverview((current) =>
        current
          ? {
              ...current,
              payments: [
                {
                  id: result.payment.id,
                  planType: "BASIC",
                  productSlug: selectedSlug,
                  durationMonths: selectedMonths,
                  provider: selectedProvider,
                  amountNpr: result.payment.amountNpr,
                  status: result.payment.status,
                  transactionId: null,
                  verifiedAt: null,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                ...current.payments,
              ],
            }
          : current
      );
      setSelectedSlug(null);
      setSelectedMonths(null);
      setSelectedProvider(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment initiation failed. Please try again.";
      setPaymentResult({ success: false, message: msg });
    } finally {
      setInitiating(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-6 md:pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Billing & Payments</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your active subscriptions and place new orders.</p>
          </div>
          <Link
            href="/subscriptions"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #dc143c, #c41232)",
              boxShadow: "0 4px 14px rgba(220,20,60,0.3)",
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Catalog
          </Link>
        </div>

        {/* Banner */}
        {paymentResult && (
          <div
            className={`flex items-start gap-3 rounded-2xl p-5 border shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 ${
              paymentResult.success
                ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-300"
                : "bg-red-900/20 border-red-500/30 text-red-300"
            }`}
          >
            {paymentResult.success ? (
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
            ) : (
              <Shield className="w-6 h-6 flex-shrink-0 text-red-400" />
            )}
            <div className="space-y-1">
               <p className="font-bold text-base">{paymentResult.success ? "Order Initiated" : "Error"}</p>
               <p className="text-sm opacity-90">{paymentResult.message}</p>
            </div>
          </div>
        )}

        {/* Current subscription + recent orders */}
        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-70">Active Plan</h2>
              <div className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                <ReceiptText className="w-3 h-3" />
                Live Status
              </div>
            </div>

            {loadingData ? (
              <div className="h-24 animate-pulse bg-white/[0.05] rounded-2xl" />
            ) : overview?.subscription ? (
              <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#dc143c]/20 flex items-center justify-center flex-shrink-0">
                    <BrandLogo name={overview.subscription.productSlug || "AI"} provider="" className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-black text-lg leading-tight truncate">
                      {productLabel(overview.subscription.productSlug, overview.subscription.durationMonths)}
                    </div>
                    <div className="text-slate-400 text-xs font-medium mt-1">
                      Renews on {new Date(overview.subscription.expiresAt).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                  {overview.subscription.status}
                </span>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <div className="text-white font-bold text-base">No active subscription</div>
                  <div className="text-slate-500 text-xs mt-1">You haven&apos;t purchased any premium plans yet.</div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-sm">
            <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-70 mb-6">Recent Transactions</h2>
            {loadingData ? (
              <div className="space-y-3">
                <div className="h-16 animate-pulse bg-white/[0.05] rounded-2xl" />
                <div className="h-16 animate-pulse bg-white/[0.05] rounded-2xl" />
              </div>
            ) : (overview?.payments.length ?? 0) > 0 ? (
              <div className="space-y-3">
                {overview!.payments.slice(0, 3).map((p) => (
                  <div key={p.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex items-center justify-between gap-3 hover:bg-white/[0.05] transition-colors">
                    <div className="min-w-0">
                      <div className="text-white font-bold text-sm truncate">
                        {productLabel(p.productSlug, p.durationMonths)}
                      </div>
                      <div className="text-slate-500 text-[11px] font-medium mt-1">Rs {p.amountNpr.toLocaleString()} · {p.provider.toUpperCase()} · {new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap border ${
                        p.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : p.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-8 text-center text-slate-500 text-sm font-medium">
                No transaction history found.
              </div>
            )}
          </div>
        </section>

        {/* Quick Purchase */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-70">Quick Order</h2>
            <Link href="/subscriptions" className="flex items-center gap-1.5 text-xs font-bold text-[#dc143c] hover:opacity-80 transition-opacity uppercase tracking-wider">
              Browse Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {productsLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-3xl bg-white/[0.05] animate-pulse" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.filter(p => p.isActive).slice(0, 8).map((plan) => {
                const isSelected = selectedSlug === plan.slug;
                return (
                  <div
                    key={plan.slug}
                    onClick={() => selectProduct(plan.slug)}
                    className={`relative rounded-3xl border cursor-pointer transition-all duration-300 p-5 ${
                      isSelected
                        ? "border-2 bg-white/[0.07] shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
                        : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.15]"
                    }`}
                    style={isSelected ? { borderColor: plan.accent } : undefined}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner"
                        style={{ background: `rgba(${plan.rgb},0.15)`, border: `1px solid rgba(${plan.rgb},0.2)` }}
                      >
                         <BrandLogo name={plan.name} provider="" className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-black text-base truncate">{plan.name}</div>
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">by {plan.provider}</div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-300">
                        {plan.durations.map((dur) => (
                          <button
                            key={dur.months}
                            onClick={(e) => { e.stopPropagation(); setSelectedMonths(dur.months); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              selectedMonths === dur.months
                                ? "text-white shadow-lg"
                                : "text-slate-400 hover:text-white bg-white/[0.02]"
                            }`}
                            style={selectedMonths === dur.months ? { background: plan.accent } : undefined}
                          >
                            <span>{dur.label}</span>
                            <span>Rs {dur.priceNpr.toLocaleString()}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-slate-400 text-xs font-bold">
                          From <span className="text-white ml-1">Rs {Math.min(...plan.durations.map((d) => d.priceNpr)).toLocaleString()}</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.1]">
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Payment Process */}
        {selectedSlug && selectedMonths && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] animate-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <CreditCard className="w-24 h-24 text-white" />
               </div>
              <h2 className="text-white font-black text-xl mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {(Object.entries(PROVIDER_INFO) as [PaymentProvider, typeof PROVIDER_INFO[PaymentProvider]][]).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedProvider(key)}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border transition-all duration-300 group ${
                      selectedProvider === key ? "scale-[1.02] shadow-xl" : "opacity-60 hover:opacity-100"
                    }`}
                    style={
                      selectedProvider === key
                        ? { borderColor: info.color, background: info.bg }
                        : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }
                    }
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner transition-transform group-hover:scale-110"
                      style={{ background: info.bg, color: info.color, border: `1px solid ${info.color}30` }}
                    >
                      {info.label.charAt(0)}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black text-white">{info.label}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{info.note}</div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedProvider && selectedDuration && selectedPlan && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Product</span>
                      <span className="text-white font-black">{selectedPlan.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Plan Type</span>
                      <span className="text-white font-black">{selectedDuration.label}</span>
                    </div>
                    <div className="h-px bg-white/[0.08] w-full" />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Payable Amount</span>
                      <span className="text-white font-black text-2xl">Rs {selectedDuration.priceNpr.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={initiating}
                    className="w-full flex items-center justify-center gap-3 bg-[#dc143c] hover:bg-[#c41232] disabled:bg-white/[0.08] text-white font-black py-4 rounded-2xl transition-all shadow-[0_8px_25px_rgba(220,20,60,0.35)] hover:shadow-[0_12px_30px_rgba(220,20,60,0.45)]"
                  >
                    {initiating ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> PROCESING...</>
                    ) : (
                      <><CheckCircle2 className="w-5 h-5" /> CONFIRM & PAY NOW</>
                    )}
                  </button>
                  <p className="text-slate-500 text-[10px] font-bold text-center uppercase tracking-widest">
                    Manual verification. Access delivered same day.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-sm flex flex-col items-center justify-center text-center">
              <h2 className="text-white font-black text-xl mb-6 self-start">Scan to Pay</h2>
              {checkout ? (
                <div className="space-y-6 w-full animate-in zoom-in-95 duration-500">
                  <div className="rounded-3xl bg-white p-6 inline-block shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <QRCode value={checkout.qrPayload} size={200} fgColor="#0f172a" bgColor="#ffffff" />
                  </div>
                  <div className="space-y-3 max-w-xs mx-auto">
                    <div className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Payment Reference</span>
                      <span className="text-xl font-black text-white font-mono tracking-tighter">{checkout.referenceCode}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">
                      Scan with your <span className="text-white font-bold">{checkout.providerLabel}</span> app and enter the reference code in remarks.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-6 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/[0.1] flex items-center justify-center text-slate-700">
                     <QRCode value="FlowAI Nepal" size={40} className="opacity-10" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium max-w-[180px]">
                    Select a plan and confirm order to generate your unique payment QR.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Info */}
        <div className="rounded-3xl border border-[#1e6fbf]/20 bg-[#1e6fbf]/05 p-6 flex gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#1e6fbf]/10 flex items-center justify-center flex-shrink-0">
             <Shield className="w-5 h-5 text-[#1e6fbf]" />
          </div>
          <div>
            <div className="text-white text-base font-bold mb-1">Safe & Secure Transactions</div>
            <div className="text-slate-400 text-sm leading-relaxed">
              We use a manual verification model to ensure the best possible prices for the Nepali market. After you pay, our operators verify the transaction ID with the wallet provider and activate your access manually. This process typically takes less than 4 hours.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

