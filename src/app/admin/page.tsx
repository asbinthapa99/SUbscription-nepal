"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Clock, Loader2, Shield, Users, X, FileText, AlertCircle, Save, ChevronRight, TrendingUp, ChevronLeft, CreditCard, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  getAdminSummary, getAdminPayments, getAdminUsers, getAdminSubscriptions, getAdminPlans,
  verifyAdminPayment, getAdminContent, updateAdminContent,
  type AdminSummary, type AdminPayment, type AdminUser, type AdminSubscription,
  type AdminContent, type AdminPlan, type PaginationMeta,
} from "@/lib/api/admin";

type Tab = "payments" | "users" | "subscriptions" | "plans" | "content";

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  EXPIRED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  TRIAL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ADMIN: "bg-[#dc143c]/10 text-[#dc143c] border-[#dc143c]/20",
  USER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const Badge = ({ label }: { label: string }) => (
  <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${STATUS_COLORS[label] ?? "bg-white/5 text-slate-400 border-white/10"}`}>{label}</span>
);

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}>{icon}</div>
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function Pagination({ meta, onPage }: { meta: PaginationMeta; onPage: (p: number) => void }) {
  if (meta.pages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
      <span className="text-slate-500 text-xs">{meta.total} total · page {meta.page} of {meta.pages}</span>
      <div className="flex gap-2">
        <button onClick={() => onPage(meta.page - 1)} disabled={meta.page <= 1} className="p-2 rounded-lg bg-white/[0.05] text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => onPage(meta.page + 1)} disabled={meta.page >= meta.pages} className="p-2 rounded-lg bg-white/[0.05] text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("payments");
  const [summary, setSummary] = useState<AdminSummary | null>(null);

  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [paymentsMeta, setPaymentsMeta] = useState<PaginationMeta | null>(null);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | "PENDING" | "PAID">("PENDING");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [txInput, setTxInput] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersMeta, setUsersMeta] = useState<PaginationMeta | null>(null);
  const [usersPage, setUsersPage] = useState(1);

  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [subsMeta, setSubsMeta] = useState<PaginationMeta | null>(null);
  const [subsPage, setSubsPage] = useState(1);

  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [content, setContent] = useState<AdminContent[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.replace("/dashboard");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      getAdminSummary().then(setSummary).catch(() => {});
    }
  }, [user]);

  const loadTab = useCallback(async (t: Tab, page = 1) => {
    if (!user || user.role !== "ADMIN") return;
    setLoading(true);
    try {
      if (t === "payments") {
        const r = await getAdminPayments(page);
        setPayments(r.payments); setPaymentsMeta(r.meta);
      } else if (t === "users") {
        const r = await getAdminUsers(page);
        setUsers(r.users); setUsersMeta(r.meta);
      } else if (t === "subscriptions") {
        const r = await getAdminSubscriptions(page);
        setSubs(r.subscriptions); setSubsMeta(r.meta);
      } else if (t === "plans") {
        const r = await getAdminPlans();
        setPlans(r.plans);
      } else if (t === "content") {
        const r = await getAdminContent();
        setContent(r.content);
      }
    } catch { /* swallow */ } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { if (user?.role === "ADMIN") loadTab(tab); }, [tab, user, loadTab]);

  async function handleVerify(paymentId: string) {
    if (txInput.trim().length < 3) { setVerifyError("Transaction ID must be at least 3 chars."); return; }
    setVerifyLoading(true); setVerifyError(null);
    try {
      await verifyAdminPayment(paymentId, txInput.trim());
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "PAID", transactionId: txInput.trim(), verifiedAt: new Date().toISOString() } : p));
      setSummary(prev => prev ? { ...prev, pendingPayments: Math.max(0, prev.pendingPayments - 1) } : prev);
      setVerifyingId(null); setTxInput("");
    } catch (e) { setVerifyError(e instanceof Error ? e.message : "Failed"); } finally { setVerifyLoading(false); }
  }

  async function handleSaveContent(key: string) {
    setSaveLoading(true);
    try {
      await updateAdminContent(key, editValue);
      setContent(prev => prev.map(c => c.key === key ? { ...c, value: editValue } : c));
      setEditingKey(null);
    } catch { /* swallow */ } finally { setSaveLoading(false); }
  }

  if (authLoading || !user || user.role !== "ADMIN") {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]"><Loader2 className="w-8 h-8 text-[#dc143c] animate-spin" /></div>;
  }

  const filteredPayments = paymentFilter === "ALL" ? payments : payments.filter(p => p.status === paymentFilter);
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "payments", label: "Payments", icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: "users", label: "Users", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "subscriptions", label: "Subscriptions", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: "plans", label: "Plans", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "content", label: "Content", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#dc143c]/10 border border-[#dc143c]/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#dc143c]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-slate-500 text-sm">FlowAI Nepal command center</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {summary ? (
            <>
              <StatCard label="Total Users" value={summary.users.toLocaleString()} icon={<Users className="w-4 h-4" />} color="#1e6fbf" />
              <StatCard label="Active Subs" value={summary.activeSubscriptions} icon={<CheckCircle2 className="w-4 h-4" />} color="#10b981" />
              <StatCard label="Pending Payments" value={summary.pendingPayments} icon={<Clock className="w-4 h-4" />} color="#f59e0b" />
              <StatCard label="API Requests" value={summary.usage.requestCount.toLocaleString()} icon={<TrendingUp className="w-4 h-4" />} color="#dc143c" />
            </>
          ) : [1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-white/[0.04] animate-pulse" />)}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl w-full overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-1 justify-center ${tab === t.id ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-white"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {loading && (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse bg-white/[0.04] rounded-2xl" />)}</div>
        )}

        {/* PAYMENTS TAB */}
        {!loading && tab === "payments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Orders <span className="text-slate-500 text-sm ml-1">({paymentsMeta?.total ?? 0})</span></span>
              <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                {(["PENDING","PAID","ALL"] as const).map(f => (
                  <button key={f} onClick={() => setPaymentFilter(f)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${paymentFilter === f ? "bg-[#dc143c] text-white" : "text-slate-500 hover:text-white"}`}>{f}</button>
                ))}
              </div>
            </div>
            {filteredPayments.length === 0 ? (
              <div className="text-center py-16 text-slate-500 border border-dashed border-white/[0.08] rounded-2xl">No {paymentFilter !== "ALL" ? paymentFilter.toLowerCase() + " " : ""}payments</div>
            ) : filteredPayments.map(p => (
              <div key={p.id} className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-white font-bold truncate">{p.productSlug ?? p.planType} · {p.durationMonths}mo</span>
                    <Badge label={p.status} />
                  </div>
                  <div className="text-slate-400 text-xs">{p.user.name} · {p.user.email}</div>
                  <div className="flex gap-3 mt-2 text-xs text-slate-500">
                    <span>NPR {p.amountNpr.toLocaleString()}</span>
                    <span className="uppercase">{p.provider}</span>
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    {p.transactionId && <span className="font-mono text-emerald-400">TX: {p.transactionId}</span>}
                  </div>
                </div>
                {p.status === "PENDING" && (
                  <div className="flex-shrink-0">
                    {verifyingId === p.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input autoFocus value={txInput} onChange={e => { setTxInput(e.target.value); setVerifyError(null); }}
                            placeholder="Transaction ID" className="bg-[#0f172a] border border-white/[0.15] rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-[#dc143c] outline-none w-44" />
                          <button onClick={() => handleVerify(p.id)} disabled={verifyLoading}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black rounded-xl flex items-center gap-1.5">
                            {verifyLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} OK
                          </button>
                          <button onClick={() => { setVerifyingId(null); setTxInput(""); setVerifyError(null); }}
                            className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                        </div>
                        {verifyError && <p className="text-red-400 text-[10px] flex gap-1"><AlertCircle className="w-3 h-3 mt-0.5" />{verifyError}</p>}
                      </div>
                    ) : (
                      <button onClick={() => { setVerifyingId(p.id); setTxInput(""); setVerifyError(null); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#dc143c] hover:bg-[#c41232] text-white text-xs font-black rounded-xl">
                        Verify <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {paymentsMeta && <Pagination meta={paymentsMeta} onPage={p => { setPaymentsPage(p); loadTab("payments", p); }} />}
          </div>
        )}

        {/* USERS TAB */}
        {!loading && tab === "users" && (
          <div className="space-y-4">
            <span className="text-white font-bold">Users <span className="text-slate-500 text-sm ml-1">({usersMeta?.total ?? 0})</span></span>
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  {["Name","Email","Role","Subscription","Payments","API Calls","Joined"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {users.map(u => {
                    const sub = u.subscriptions[0];
                    return (
                      <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{u.name}</td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{u.email}</td>
                        <td className="px-4 py-3"><Badge label={u.role} /></td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {sub ? <span className="flex items-center gap-1.5"><Badge label={sub.status} /><span className="text-slate-500 text-xs">{sub.productSlug ?? sub.planType}</span></span> : <span className="text-slate-600 text-xs">None</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-center">{u._count.payments}</td>
                        <td className="px-4 py-3 text-slate-400 text-center">{u._count.usageLogs}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {usersMeta && <Pagination meta={usersMeta} onPage={p => { setUsersPage(p); loadTab("users", p); }} />}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {!loading && tab === "subscriptions" && (
          <div className="space-y-4">
            <span className="text-white font-bold">Subscriptions <span className="text-slate-500 text-sm ml-1">({subsMeta?.total ?? 0})</span></span>
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  {["User","Plan / Product","Status","Duration","Expires","Created"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {subs.map(s => (
                    <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-white font-medium text-xs">{s.user.name}</div>
                        <div className="text-slate-500 text-[10px]">{s.user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-xs whitespace-nowrap">{s.productSlug ?? s.planType}</td>
                      <td className="px-4 py-3"><Badge label={s.status} /></td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{s.durationMonths}mo</td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{new Date(s.expiresAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {subsMeta && <Pagination meta={subsMeta} onPage={p => { setSubsPage(p); loadTab("subscriptions", p); }} />}
          </div>
        )}

        {/* PLANS TAB */}
        {!loading && tab === "plans" && (
          <div className="space-y-4">
            <span className="text-white font-bold">Plan Tiers <span className="text-slate-500 text-sm ml-1">({plans.length})</span></span>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map(p => (
                <div key={p.id} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-black">{p.name}</span>
                    <Badge label={p.isActive ? "ACTIVE" : "INACTIVE"} />
                  </div>
                  <div className="text-2xl font-black text-white mb-3">NPR {p.priceNpr.toLocaleString()}<span className="text-slate-500 text-sm font-normal">/mo</span></div>
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between"><span>Daily prompts</span><span className="text-white font-bold">{p.dailyPromptLimit.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Monthly tokens</span><span className="text-white font-bold">{(p.monthlyTokenLimit / 1000).toFixed(0)}k</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {!loading && tab === "content" && (
          <div className="space-y-4">
            <span className="text-white font-bold">Site Content <span className="text-slate-500 text-sm ml-1">({content.length})</span></span>
            <div className="grid gap-4">
              {content.map(item => (
                <div key={item.id} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{item.section}</div>
                      <div className="text-white font-bold text-sm">{item.key}</div>
                    </div>
                    {editingKey !== item.key && (
                      <button onClick={() => { setEditingKey(item.key); setEditValue(item.value); }}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-white transition-all">Edit</button>
                    )}
                  </div>
                  {editingKey === item.key ? (
                    <div className="space-y-3">
                      <textarea value={editValue} onChange={e => setEditValue(e.target.value)}
                        className="w-full h-28 bg-[#0f172a] border border-white/[0.15] rounded-xl px-4 py-3 text-sm text-white focus:border-[#1e6fbf] outline-none resize-none" />
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveContent(item.key)} disabled={saveLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1e6fbf] hover:bg-[#165a9e] text-white text-xs font-black rounded-xl">
                          {saveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                        </button>
                        <button onClick={() => setEditingKey(null)} className="px-4 py-2 bg-white/[0.05] text-slate-400 hover:text-white text-xs font-black rounded-xl">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
