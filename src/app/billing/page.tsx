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
} from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  getBillingOverview,
  initiatePayment,
  type BillingOverview,
  type InitiatePaymentCheckout,
} from "@/lib/api/subscription";
import { subscriptionCatalog } from "@/lib/subscriptions";

type PaymentProvider = "esewa" | "khalti" | "imepay";

const PROVIDER_INFO: Record<PaymentProvider, { label: string; color: string; bg: string; note: string }> = {
  esewa: { label: "eSewa", color: "#60b246", bg: "#60b24620", note: "Wallet checkout" },
  khalti: { label: "Khalti", color: "#5c2d91", bg: "#5c2d9120", note: "Wallet checkout" },
  imepay: { label: "IME Pay", color: "#e84a4a", bg: "#e84a4a20", note: "Manual verify" },
};

function productLabel(slug: string | null, months: number): string {
  if (!slug) return "Subscription";
  const plan = subscriptionCatalog.find((p) => p.slug === slug);
  const name = plan?.name ?? slug;
  return `${name} — ${months} month${months > 1 ? "s" : ""}`;
}

export default function BillingPage() {
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

  const selectedPlan = subscriptionCatalog.find((p) => p.slug === selectedSlug);
  const selectedDuration = selectedPlan?.durations.find((d) => d.months === selectedMonths);

  function selectProduct(slug: string) {
    if (selectedSlug === slug) {
      setSelectedSlug(null);
      setSelectedMonths(null);
    } else {
      setSelectedSlug(slug);
      const plan = subscriptionCatalog.find((p) => p.slug === slug);
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Place an Order</h1>
          <p className="text-slate-400 text-sm mt-1">Select a subscription, pay via QR, and we deliver access within 24 hours.</p>
        </div>

        {/* Banner */}
        {paymentResult && (
          <div
            className={`flex items-start gap-3 rounded-xl p-4 border text-sm ${
              paymentResult.success
                ? "bg-emerald-900/20 border-emerald-700/30 text-emerald-300"
                : "bg-red-900/20 border-red-700/30 text-red-300"
            }`}
          >
            {paymentResult.success ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <Shield className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            )}
            <span>{paymentResult.message}</span>
          </div>
        )}

        {/* Current subscription + recent orders */}
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Current subscription</h2>
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                <ReceiptText className="w-3.5 h-3.5" />
                Billing
              </div>
            </div>

            {loadingData ? (
              <div className="h-20 animate-pulse bg-white/[0.05] rounded-xl" />
            ) : overview?.subscription ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#dc143c]/15 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-[#dc143c]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-bold truncate">
                      {productLabel(overview.subscription.productSlug, overview.subscription.durationMonths)}
                    </div>
                    <div className="text-slate-400 text-xs">
                      Expires {new Date(overview.subscription.expiresAt).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-700/30 whitespace-nowrap">
                  {overview.subscription.status}
                </span>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.03] p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">No active subscription</div>
                  <div className="text-slate-400 text-xs">Select a plan below to get started.</div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Recent orders</h2>
            {loadingData ? (
              <div className="space-y-2">
                <div className="h-14 animate-pulse bg-white/[0.05] rounded-xl" />
                <div className="h-14 animate-pulse bg-white/[0.05] rounded-xl" />
              </div>
            ) : (overview?.payments.length ?? 0) > 0 ? (
              <div className="space-y-2">
                {overview!.payments.slice(0, 4).map((p) => (
                  <div key={p.id} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {productLabel(p.productSlug, p.durationMonths)}
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">Rs {p.amountNpr.toLocaleString()} · {p.provider}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${
                        p.status === "PAID"
                          ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/30"
                          : p.status === "PENDING"
                            ? "bg-yellow-900/40 text-yellow-300 border border-yellow-700/30"
                            : "bg-slate-800 text-slate-300 border border-white/[0.08]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.03] p-4 text-sm text-slate-400">
                No orders yet. Place your first order below.
              </div>
            )}
          </div>
        </section>

        {/* Subscription catalog */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Choose a subscription</h2>
            <Link href="/subscriptions" className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
              View details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {subscriptionCatalog.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedSlug === plan.slug;
              return (
                <div
                  key={plan.slug}
                  onClick={() => selectProduct(plan.slug)}
                  className={`relative rounded-2xl border cursor-pointer transition-all duration-200 p-4 ${
                    isSelected
                      ? "border-2 bg-white/[0.05]"
                      : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.14]"
                  }`}
                  style={isSelected ? { borderColor: plan.accent } : undefined}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `rgba(${plan.rgb},0.15)` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: plan.accent }} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{plan.name}</div>
                      <div className="text-slate-500 text-xs">by {plan.provider}</div>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="space-y-1">
                      {plan.durations.map((dur) => (
                        <button
                          key={dur.months}
                          onClick={(e) => { e.stopPropagation(); setSelectedMonths(dur.months); }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedMonths === dur.months
                              ? "text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                          style={selectedMonths === dur.months ? { background: `rgba(${plan.rgb},0.2)`, color: plan.accent } : undefined}
                        >
                          <span>{dur.label}</span>
                          <span>Rs {dur.priceNpr.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs">
                      From Rs {Math.min(...plan.durations.map((d) => d.priceNpr)).toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment + QR */}
        {selectedSlug && selectedMonths && (
          <section className="grid gap-4 lg:grid-cols-[1fr_0.92fr]">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Pay via</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {(Object.entries(PROVIDER_INFO) as [PaymentProvider, typeof PROVIDER_INFO[PaymentProvider]][]).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedProvider(key)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-150 ${
                      selectedProvider === key ? "border-current" : "border-white/[0.08] hover:border-white/[0.2]"
                    }`}
                    style={
                      selectedProvider === key
                        ? { color: info.color, background: info.bg, borderColor: info.color }
                        : { color: "#94a3b8", background: "rgba(255,255,255,0.03)" }
                    }
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                      style={{ background: info.bg, color: info.color }}
                    >
                      {info.label.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white">{info.label}</div>
                      <div className="text-[11px] text-slate-500">{info.note}</div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedProvider && selectedDuration && selectedPlan && (
                <div className="border-t border-white/[0.06] pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Product</span>
                    <span className="text-white font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Duration</span>
                    <span className="text-white font-medium">{selectedDuration.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Payment via</span>
                    <span className="text-white font-medium">{PROVIDER_INFO[selectedProvider].label}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total</span>
                    <span className="text-white font-bold text-base">Rs {selectedDuration.priceNpr.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={initiating}
                    className="w-full flex items-center justify-center gap-2 bg-[#dc143c] hover:bg-[#c41232] disabled:bg-white/[0.08] text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
                  >
                    {initiating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating order...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm order & get QR
                      </>
                    )}
                  </button>
                  <p className="text-slate-500 text-xs text-center">
                    We&apos;ll email your order confirmation and QR code to your account email.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Payment QR</h2>
              {checkout ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white p-4 flex items-center justify-center">
                    <QRCode value={checkout.qrPayload} size={160} fgColor="#0f172a" bgColor="#ffffff" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-400">Reference</span>
                      <span className="text-white font-semibold font-mono">{checkout.referenceCode}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-400">Provider</span>
                      <span className="text-white font-semibold">{checkout.providerLabel}</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-xs text-slate-300">
                    {checkout.message}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.03] p-5 text-sm text-slate-400 text-center">
                  Select a product, duration, and payment provider — then confirm your order to generate the QR.
                </div>
              )}
            </div>
          </section>
        )}

        {/* Info */}
        <div className="rounded-xl border border-[#1e6fbf]/20 bg-[#1e6fbf]/05 p-4 flex gap-3">
          <Shield className="w-5 h-5 text-[#1e6fbf] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-white text-sm font-medium mb-0.5">How it works</div>
            <div className="text-slate-400 text-xs">
              Select a subscription and duration → pay via eSewa, Khalti, or IME Pay using the QR code → our team verifies your payment within 24 hours → you receive your access credentials by email.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
