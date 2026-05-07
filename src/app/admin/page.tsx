"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  getAdminSummary,
  getAdminPayments,
  verifyAdminPayment,
  type AdminSummary,
  type AdminPayment,
} from "@/lib/api/admin";
import { subscriptionCatalog } from "@/lib/subscriptions";

function productLabel(slug: string | null, months: number): string {
  if (!slug) return "Subscription";
  const plan = subscriptionCatalog.find((p) => p.slug === slug);
  return `${plan?.name ?? slug} · ${months}mo`;
}

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/30",
  PENDING: "bg-yellow-900/40 text-yellow-300 border border-yellow-700/30",
  FAILED: "bg-red-900/40 text-red-300 border border-red-700/30",
};

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider mb-1">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "PAID">("PENDING");

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [txInput, setTxInput] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    Promise.all([getAdminSummary(), getAdminPayments()])
      .then(([s, p]) => {
        setSummary(s);
        setPayments(p.payments);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleVerify(paymentId: string) {
    if (txInput.trim().length < 3) {
      setVerifyError("Transaction ID must be at least 3 characters.");
      return;
    }
    setVerifyLoading(true);
    setVerifyError(null);
    try {
      await verifyAdminPayment(paymentId, txInput.trim());
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? { ...p, status: "PAID", transactionId: txInput.trim(), verifiedAt: new Date().toISOString() }
            : p
        )
      );
      setSummary((prev) =>
        prev ? { ...prev, pendingPayments: Math.max(0, prev.pendingPayments - 1) } : prev
      );
      setVerifyingId(null);
      setTxInput("");
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setVerifyLoading(false);
    }
  }

  const filtered = filter === "ALL" ? payments : payments.filter((p) => p.status === filter);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#dc143c]/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#dc143c]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm">Verify payments and manage subscriptions.</p>
          </div>
        </div>

        {/* Summary */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse bg-white/[0.05] rounded-xl" />
            ))}
          </div>
        ) : summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard label="Total users" value={summary.users} icon={<Users className="w-3.5 h-3.5" />} />
            <StatCard label="Active subscriptions" value={summary.activeSubscriptions} icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
            <StatCard
              label="Pending payments"
              value={summary.pendingPayments}
              icon={<Clock className="w-3.5 h-3.5 text-yellow-400" />}
            />
          </div>
        )}

        {/* Payments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Payments</h2>
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg border border-white/[0.08] p-1">
              {(["PENDING", "PAID", "ALL"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    filter === f ? "bg-white/[0.1] text-white" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-white/[0.05] rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center text-slate-400 text-sm">
              No {filter === "ALL" ? "" : filter.toLowerCase()} payments.
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
              {filtered.map((payment, idx) => (
                <div
                  key={payment.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                    idx < filtered.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">
                        {productLabel(payment.productSlug, payment.durationMonths)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          STATUS_STYLE[payment.status] ?? "bg-slate-800 text-slate-300 border border-white/[0.08]"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs mt-1">
                      {payment.user.name} · {payment.user.email}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      Rs {payment.amountNpr.toLocaleString()} · {payment.provider} ·{" "}
                      {new Date(payment.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    {payment.transactionId && (
                      <div className="text-slate-600 text-xs mt-0.5 font-mono">TX: {payment.transactionId}</div>
                    )}
                  </div>

                  {payment.status === "PENDING" && (
                    <div className="flex-shrink-0">
                      {verifyingId === payment.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={txInput}
                            onChange={(e) => { setTxInput(e.target.value); setVerifyError(null); }}
                            placeholder="Transaction ID"
                            className="bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/[0.3] w-40"
                          />
                          <button
                            onClick={() => handleVerify(payment.id)}
                            disabled={verifyLoading}
                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/[0.08] text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            {verifyLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            Verify
                          </button>
                          <button
                            onClick={() => { setVerifyingId(null); setTxInput(""); setVerifyError(null); }}
                            className="p-2 text-slate-500 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setVerifyingId(payment.id); setTxInput(""); setVerifyError(null); }}
                          className="px-4 py-2 bg-[#dc143c] hover:bg-[#c41232] text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Verify payment
                        </button>
                      )}
                      {verifyingId === payment.id && verifyError && (
                        <p className="text-red-400 text-xs mt-1">{verifyError}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
