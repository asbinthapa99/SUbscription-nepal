"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    
    setLoading(true);
    setStatus(null);
    
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to request password reset");
      }
      
      setStatus({ 
        type: "success", 
        message: "If an account exists for this email, you will receive reset instructions shortly." 
      });
      setEmail("");
    } catch (err: any) {
      setStatus({ 
        type: "error", 
        message: err?.message || "Something went wrong. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-4" style={{ background: "#f8f9ff" }}>
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to login
          </Link>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="mb-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#dc143c]/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-[#dc143c]" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Reset password</h1>
              <p className="text-slate-500 text-sm font-medium">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-[#dc143c] focus:ring-4 focus:ring-[#dc143c]/5 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#dc143c] hover:bg-[#c41232] disabled:bg-slate-200 text-white font-black text-sm transition-all shadow-lg shadow-[#dc143c]/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            {status && (
              <div className={`mt-6 p-4 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                status.type === "success" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}>
                {status.type === "success" ? (
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-xs font-bold leading-relaxed">{status.message}</p>
              </div>
            )}
          </div>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button onClick={() => setStatus(null)} className="text-[#dc143c] font-bold hover:underline">try again</button>
          </p>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}

