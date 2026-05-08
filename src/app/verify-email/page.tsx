"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import Link from "next/link";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("Missing verification token."); return; }
    apiFetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => { setStatus("success"); setTimeout(() => router.push("/dashboard"), 3000); })
      .catch((e: unknown) => { setStatus("error"); setMessage(e instanceof Error ? e.message : "Verification failed."); });
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-[#dc143c] animate-spin mx-auto mb-4" />
            <h1 className="text-white font-black text-xl mb-2">Verifying your email…</h1>
            <p className="text-slate-500 text-sm">Please wait a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-white font-black text-xl mb-2">Email verified!</h1>
            <p className="text-slate-400 text-sm mb-6">Your account is fully activated. Redirecting to dashboard…</p>
            <Link href="/dashboard" className="px-6 py-3 bg-[#dc143c] hover:bg-[#c41232] text-white text-sm font-black rounded-xl inline-block transition-colors">Go to Dashboard</Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-white font-black text-xl mb-2">Verification failed</h1>
            <p className="text-slate-400 text-sm mb-6">{message || "This link may have expired. Request a new one from your dashboard."}</p>
            <Link href="/dashboard" className="px-6 py-3 bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-black rounded-xl inline-block transition-colors">Back to Dashboard</Link>
          </>
        )}
      </div>
    </div>
  );
}
