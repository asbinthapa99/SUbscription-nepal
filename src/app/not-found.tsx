"use client";

import Link from "next/link";
import { Ghost, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1526] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-[#1e6fbf]/10 border border-[#1e6fbf]/20 flex items-center justify-center mx-auto mb-6">
            <Ghost className="w-12 h-12 text-[#1e6fbf]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1e6fbf] flex items-center justify-center text-white font-bold text-lg shadow-lg">
             ?
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-white tracking-tighter">404 Lost in Space</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved to a different galaxy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl"
          >
            <Home className="w-4 h-4" />
            BACK TO HOME
          </Link>
          <Link
            href="/subscriptions"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/[0.05] border border-white/[0.08] text-white font-black rounded-2xl hover:bg-white/[0.1] transition-all"
          >
            <Search className="w-4 h-4" />
            BROWSE TOOLS
          </Link>
        </div>
        
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
           FlowAI Nepal · Production Environment
        </p>
      </div>
    </div>
  );
}
