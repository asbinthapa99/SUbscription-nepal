"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Tag,
  User,
  LayoutDashboard,
  LogIn,
  ShoppingBag,
  UserPlus,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";

const guestItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/subscriptions", label: "Browse", icon: ShoppingBag },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/register", label: "Sign Up", icon: UserPlus },
  { href: "/login", label: "Sign In", icon: LogIn },
];

const authItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/subscriptions", label: "Browse", icon: ShoppingBag },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/billing", label: "Orders", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide on auth pages
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return null;
  }

  const navItems = user ? authItems : guestItems;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-3 left-1/2 z-40 w-[calc(100vw-1rem)] max-w-md -translate-x-1/2 rounded-3xl border border-white/30 bg-white/65 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.25)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-2xl text-xs font-semibold transition-all duration-300 transform hover:scale-105 min-w-0 flex-1",
                  isActive
                    ? "bg-gradient-to-br from-[#dc143c] to-[#c41232] text-white shadow-lg shadow-red-500/30"
                    : "text-gray-700 hover:bg-white/60 hover:text-[#dc143c]"
                )}
                title={item.label}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-semibold truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="md:hidden h-24" />
    </>
  );
}
