"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import authApi from "@/lib/api/auth";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setStatus({ type: "error", message: "Invalid or missing reset token." });
      return;
    }
    if (password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters long." });
      return;
    }

    setLoading(true);
    setStatus(null);
    
    try {
      await authApi.apiResetPassword(token, password);
      setStatus({ type: "success", message: "Password reset successful! Redirecting to login..." });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      setStatus({ 
        type: "error", 
        message: err instanceof Error ? err.message : "Failed to reset password. The link may have expired." 
      });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
     return (
        <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
           <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
           <p className="text-red-700 font-bold">Invalid Reset Link</p>
           <p className="text-xs text-red-600 mt-1">This link is missing a required security token.</p>
        </div>
     );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:border-[#dc143c] focus:ring-4 focus:ring-[#dc143c]/5 outline-none transition-all text-sm font-medium"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
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
          "Reset password"
        )}
      </button>

      {status && (
        <div className={`p-4 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          status.type === "success" 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
            : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {status.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-xs font-bold leading-relaxed">{status.message}</p>
        </div>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-4" style={{ background: "#f8f9ff" }}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="mb-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#dc143c]/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-[#dc143c]" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">New password</h1>
              <p className="text-slate-500 text-sm font-medium">
                Please enter a new secure password for your FlowAI Nepal account.
              </p>
            </div>

            <Suspense fallback={
               <div className="space-y-6">
                  <div className="h-14 bg-slate-50 animate-pulse rounded-2xl" />
                  <div className="h-14 bg-slate-200 animate-pulse rounded-2xl" />
               </div>
            }>
              <ResetForm />
            </Suspense>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}

