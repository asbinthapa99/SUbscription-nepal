"use client";

import React from "react";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Scale, AlertCircle, RefreshCcw, UserCheck } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "October 24, 2023";

  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen pt-28 pb-20 px-4 md:px-6 lg:px-8" style={{ background: "#f8f9ff" }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-wider mb-4">
              <Scale className="w-3 h-3" />
              Legal Framework
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-[#dc143c]" />
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing or using FlowAI Nepal, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-[#dc143c]" />
                2. Subscription and Payments
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  FlowAI Nepal provides access to premium AI tools through a manual verification model. You agree to provide accurate payment information (Reference Code / Transaction ID).
                </p>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-sm">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>
                      <strong>Verification Time:</strong> Most payments are verified within 1–4 hours. However, it can take up to 24 hours in some cases.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <RefreshCcw className="w-6 h-6 text-[#dc143c]" />
                3. Refund Policy
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We offer a 7-day replacement guarantee. If a shared account or tool access fails, we will provide a new one. Refunds are only issued if we are unable to provide the promised service within 48 hours of verification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-[#dc143c]" />
                4. Prohibited Usage
              </h2>
              <p className="text-slate-600 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>Resell your account access to third parties.</li>
                <li>Use the AI tools for generating illegal or harmful content.</li>
                <li>Attempt to bypass rate limits or security measures.</li>
                <li>Share shared-plan credentials outside of our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                FlowAI Nepal is a proxy service provider. We are not responsible for any downtime or changes in policy made by the original AI tool providers (e.g., OpenAI, Netflix).
              </p>
            </section>

            <div className="pt-8 border-t border-slate-100">
              <p className="text-slate-500 text-sm italic">
                By clicking &quot;Register&quot; or &quot;Order&quot;, you acknowledge that you have read and understood these Terms.
              </p>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
