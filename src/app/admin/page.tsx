"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Shield,
  Users,
  X,
  FileText,
  AlertCircle,
  Save,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useProducts } from "@/context/ProductProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  getAdminSummary,
  getAdminPayments,
  verifyAdminPayment,
  getAdminContent,
  updateAdminContent,
  type AdminSummary,
  type AdminPayment,
  type AdminContent,
} from "@/lib/api/admin";

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  FAILED: "bg-red-500/10 text-red-500 border border-red-500/20",
};

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-sm hover:bg-white/[0.06] transition-all">
      <div className="flex items-center gap-3 mb-3">
         <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
            {icon}
         </div>
         <div className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{label}</div>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { products } = useProducts();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"payments" | "content">("payments");
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [content, setContent] = useState<AdminContent[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<"ALL" | "PENDING" | "PAID">("PENDING");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [txInput, setTxInput] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const [s, p, c] = await Promise.all([
          getAdminSummary(),
          getAdminPayments(),
          getAdminContent(),
        ]);
        setSummary(s);
        setPayments(p.payments);
        setContent(c.content);
      } catch (err) {
        console.error("Admin load failed", err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.role === "ADMIN") loadData();
  }, [user]);

  function productLabel(slug: string | null, months: number): string {
    if (!slug) return "Subscription";
    const plan = products.find((p) => p.slug === slug);
    return `${plan?.name ?? slug} · ${months}mo`;
  }

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

  async function handleSaveContent(key: string) {
    setSaveLoading(true);
    try {
      await updateAdminContent(key, editValue);
      setContent((prev) =>
        prev.map((c) => (c.key === key ? { ...c, value: editValue } : c))
      );
      setEditingKey(null);
    } catch (err) {
      console.error("Save content failed", err);
    } finally {
      setSaveLoading(false);
    }
  }

  const filteredPayments = filter === "ALL" ? payments : payments.filter((p) => p.status === filter);

  if (authLoading || (user && user.role !== "ADMIN")) {
     return <div className="min-h-screen flex items-center justify-center bg-[#0d1526]"><Loader2 className="w-10 h-10 text-[#dc143c] animate-spin" /></div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#dc143c]/10 border border-[#dc143c]/20 flex items-center justify-center shadow-lg shadow-[#dc143c]/5">
              <Shield className="w-7 h-7 text-[#dc143c]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Command Center</h1>
              <p className="text-slate-400 text-sm font-medium">FlowAI Nepal Administration Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-1 p-1.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl self-start md:self-center">
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                activeTab === "payments" ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-white"
              }`}
            >
              PAYMENTS
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                activeTab === "content" ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-white"
              }`}
            >
              SITE CONTENT
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {loading ? (
             [1,2,3,4].map(i => <div key={i} className="h-28 rounded-3xl bg-white/[0.05] animate-pulse" />)
           ) : summary && (
             <>
               <StatCard label="Total Users" value={summary.users.toLocaleString()} icon={<Users className="w-5 h-5" />} color="#1e6fbf" />
               <StatCard label="Active Plans" value={summary.activeSubscriptions} icon={<CheckCircle2 className="w-5 h-5" />} color="#10b981" />
               <StatCard label="Pending" value={summary.pendingPayments} icon={<Clock className="w-5 h-5" />} color="#f59e0b" />
               <StatCard label="API Requests" value={summary.usage.requestCount.toLocaleString()} icon={<TrendingUp className="w-5 h-5" />} color="#dc143c" />
             </>
           )}
        </section>

        {activeTab === "payments" ? (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-black text-xl flex items-center gap-2">
                 Incoming Orders
                 <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/[0.05] text-slate-500 border border-white/[0.05]">
                    {filteredPayments.length}
                 </span>
              </h2>
              <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                {(["PENDING", "PAID", "ALL"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                      filter === f ? "bg-[#dc143c] text-white shadow-lg" : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 animate-pulse bg-white/[0.05] rounded-3xl" />
                ))}
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.02] p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                   <Clock className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 font-bold">No {filter === "ALL" ? "" : filter.toLowerCase()} payments found.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="group bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] p-5 rounded-3xl transition-all flex flex-col md:flex-row md:items-center gap-5"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-black text-base truncate">
                          {productLabel(payment.productSlug, payment.durationMonths)}
                        </span>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${STATUS_STYLE[payment.status]}`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                           <Users className="w-3.5 h-3.5 opacity-50" />
                           {payment.user.name} ({payment.user.email})
                        </div>
                        <div className="flex items-center gap-1.5">
                           <Clock className="w-3.5 h-3.5 opacity-50" />
                           {new Date(payment.createdAt).toLocaleString("en-NP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                         <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-black text-slate-300">
                            RS {payment.amountNpr.toLocaleString()}
                         </div>
                         <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            {payment.provider}
                         </div>
                         {payment.transactionId && (
                           <div className="text-emerald-500/80 text-[10px] font-mono font-bold tracking-tight">
                              TX: {payment.transactionId}
                           </div>
                         )}
                      </div>
                    </div>

                    {payment.status === "PENDING" && (
                      <div className="flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.05]">
                        {verifyingId === payment.id ? (
                          <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
                            <input
                              type="text"
                              autoFocus
                              value={txInput}
                              onChange={(e) => { setTxInput(e.target.value); setVerifyError(null); }}
                              placeholder="Transaction ID"
                              className="bg-[#0f172a] border border-white/[0.15] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#dc143c] outline-none w-48 shadow-2xl"
                            />
                            <button
                              onClick={() => handleVerify(payment.id)}
                              disabled={verifyLoading}
                              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                            >
                              {verifyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                              VERIFY
                            </button>
                            <button
                              onClick={() => { setVerifyingId(null); setTxInput(""); setVerifyError(null); }}
                              className="p-2.5 rounded-xl bg-white/[0.05] text-slate-500 hover:text-white transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setVerifyingId(payment.id); setTxInput(""); setVerifyError(null); }}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#dc143c] hover:bg-[#c41232] text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-[#dc143c]/20"
                          >
                            VERIFY PAYMENT
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                        {verifyingId === payment.id && verifyError && (
                          <p className="text-red-400 text-[10px] font-bold mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {verifyError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-black text-xl flex items-center gap-2">
                 Editable Content
                 <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/[0.05] text-slate-500 border border-white/[0.05]">
                    {content.length}
                 </span>
              </h2>
            </div>

            <div className="grid gap-4">
              {content.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-all">
                   <div className="flex items-center justify-between mb-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                           <FileText className="w-3.5 h-3.5 text-[#1e6fbf]" />
                           <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.section}</span>
                        </div>
                        <h3 className="text-white font-bold text-base">{item.key}</h3>
                      </div>
                      {editingKey !== item.key && (
                        <button
                          onClick={() => { setEditingKey(item.key); setEditValue(item.value); }}
                          className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-white transition-all"
                        >
                          EDIT
                        </button>
                      )}
                   </div>
                   
                   {editingKey === item.key ? (
                      <div className="space-y-4 animate-in fade-in duration-300">
                         <textarea
                           value={editValue}
                           onChange={(e) => setEditValue(e.target.value)}
                           className="w-full h-32 bg-[#0f172a] border border-white/[0.15] rounded-2xl px-4 py-3 text-sm text-white focus:border-[#1e6fbf] outline-none resize-none shadow-inner"
                         />
                         <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleSaveContent(item.key)}
                              disabled={saveLoading}
                              className="flex items-center gap-2 px-5 py-2.5 bg-[#1e6fbf] hover:bg-[#165a9e] text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-[#1e6fbf]/20"
                            >
                              {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              SAVE CHANGES
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white text-xs font-black rounded-xl transition-all"
                            >
                              CANCEL
                            </button>
                         </div>
                      </div>
                   ) : (
                      <p className="text-slate-400 text-sm font-medium leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04]">
                         {item.value}
                      </p>
                   )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

