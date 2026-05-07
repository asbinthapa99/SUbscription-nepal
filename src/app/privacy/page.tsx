"use client";

import React from "react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "October 24, 2023";

  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-28 pb-20 px-4 md:px-6 lg:px-8" style={{ background: "#f8f9ff" }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold uppercase tracking-wider mb-4">
              <Lock className="w-3 h-3" />
              Privacy First
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#dc143c]" />
                1. Introduction
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Welcome to FlowAI Nepal. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI service platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#dc143c]" />
                2. Data We Collect
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900">Account Information</h3>
                    <p className="text-sm text-slate-600">Name, email address, and encrypted passwords used for authentication.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900">Transaction Details</h3>
                    <p className="text-sm text-slate-600">Reference codes and transaction IDs from eSewa, Khalti, or IME Pay for subscription verification.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900">Usage Data</h3>
                    <p className="text-sm text-slate-600">Metrics on your AI tool usage (prompts, tokens) to manage subscription limits.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-[#dc143c]" />
                3. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>To provide and maintain our Service.</li>
                <li>To verify payments and activate subscriptions.</li>
                <li>To notify you about changes to our Service or renewals.</li>
                <li>To provide customer support.</li>
                <li>To monitor the usage of the Service to prevent abuse.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#dc143c]" />
                4. Data Security
              </h2>
              <p className="text-slate-600 leading-relaxed">
                The security of your data is important to us. We use industry-standard encryption and security measures (like HttpOnly cookies and JWT) to protect your personal information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-6 rounded-2xl bg-slate-900 text-white inline-block">
                <p className="font-bold">FlowAI Nepal Support</p>
                <p className="text-slate-400">Email: support@flowainepal.com</p>
                <p className="text-slate-400">Kathmandu, Nepal</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
