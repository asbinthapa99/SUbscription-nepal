import { BarChart3, CheckCircle2, CreditCard, List, PackageCheck } from "lucide-react";
import { dashboardMetrics } from "@/lib/home";

const subscriptionCards = [
  {
    name: "Netflix Standard",
    status: "Active",
    detail: "Renews in 23 days",
    color: "#e50914",
    rgb: "229,9,20",
  },
  {
    name: "ChatGPT Plus",
    status: "Active",
    detail: "Renews in 8 days",
    color: "#10a37f",
    rgb: "16,163,127",
  },
];

export function DashboardPreviewSection() {
  return (
    <section className="py-20 md:py-28 bg-[#07111f] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-[#fbbf24] uppercase tracking-[0.15em] mb-3">
              Your account
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-balance">
              Track your subscriptions in one place.
            </h2>
            <p className="text-slate-300 text-lg mt-4 leading-relaxed">
              See all your active subscriptions, renewal dates, and order history from a single clean dashboard.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              {dashboardMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-white/10 bg-white/[0.06] backdrop-blur-xl p-4"
                >
                  <p className="text-xs text-slate-400">{metric.label}</p>
                  <p className="font-heading font-extrabold text-2xl mt-2">{metric.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.07] backdrop-blur-2xl shadow-2xl shadow-black/30 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                  <PackageCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-heading font-semibold">FlowAI Nepal</p>
                  <p className="text-xs text-slate-400">My subscriptions</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All active
              </div>
            </div>

            <div className="grid md:grid-cols-[210px_1fr] min-h-[430px]">
              <aside className="border-r border-white/10 p-4 hidden md:block">
                {[
                  { icon: List, label: "My Subscriptions" },
                  { icon: BarChart3, label: "Order History" },
                  { icon: CreditCard, label: "Billing" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                        index === 0 ? "bg-white/10 text-white" : "text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  );
                })}
              </aside>

              <div className="p-5">
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs text-slate-400 mb-2">Active subscriptions</p>
                    <p className="font-heading font-semibold text-lg">2 plans</p>
                    <p className="text-sm text-slate-400 mt-1">Netflix + ChatGPT Plus</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs text-slate-400 mb-2">Payment method</p>
                    <p className="font-heading font-semibold text-lg">eSewa</p>
                    <p className="text-sm text-slate-400 mt-1">Paid in NPR</p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-3">
                  {subscriptionCards.map((card) => (
                    <div key={card.name} className="rounded-lg bg-white/[0.06] p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{card.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{card.detail}</p>
                      </div>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `rgba(${card.rgb},0.15)`, color: card.color }}
                      >
                        {card.status}
                      </span>
                    </div>
                  ))}
                  <div className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-400">
                    Browse more subscriptions...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
