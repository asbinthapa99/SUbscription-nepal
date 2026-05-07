import Link from "next/link";
import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Product: [
    { href: "#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/changelog", label: "Changelog" },
    { href: "/roadmap", label: "Roadmap" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/refunds", label: "Refund Policy" },
  ],
  Support: [
    { href: "/docs", label: "Documentation" },
    { href: "/faq", label: "FAQ" },
    { href: "/status", label: "System Status" },
    { href: "mailto:support@flowainepal.com", label: "Email Support" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Top: logo + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-heading font-bold text-lg mb-4">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Flow<span className="text-[#dc143c]">AI</span> Nepal</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Premium AI tools for everyone in Nepal. Pay in NPR, no international card needed.
            </p>
            {/* Payment logos */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-[#60BB46] text-white px-2 py-1 rounded font-semibold">eSewa</span>
              <span className="text-xs bg-[#5C2D91] text-white px-2 py-1 rounded font-semibold">Khalti</span>
              <span className="text-xs bg-[#E30613] text-white px-2 py-1 rounded font-semibold">IME Pay</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FlowAI Nepal. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="text-[#dc143c]">🇳🇵</span>
            <span>Made with pride in Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
