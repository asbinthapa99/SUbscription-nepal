"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiFetch } from "@/lib/api/client";

type Tab = "profile" | "security";

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  // Profile tab state
  const [name, setName] = useState(user?.name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileResult, setProfileResult] = useState<{ success: boolean; message: string } | null>(null);

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordResult, setPasswordResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileResult(null);
    try {
      await apiFetch("/api/auth/me", { method: "PATCH", body: JSON.stringify({ name }) });
      setProfileResult({ success: true, message: "Profile updated successfully." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      setProfileResult({ success: false, message: msg });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordResult(null);
    if (newPassword !== confirmPassword) {
      setPasswordResult({ success: false, message: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordResult({ success: false, message: "Password must be at least 8 characters." });
      return;
    }
    setSavingPassword(true);
    try {
      await apiFetch("/api/auth/reset", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordResult({ success: true, message: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      setPasswordResult({ success: false, message: msg });
    } finally {
      setSavingPassword(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account preferences.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl mb-6 w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setProfileResult(null); setPasswordResult(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  tab === t.id
                    ? "bg-[#dc143c] text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-6">
            <h2 className="text-white font-semibold mb-5">Profile Information</h2>
            {profileResult && (
              <div
                className={`mb-4 flex items-start gap-2 rounded-lg p-3 text-sm border ${
                  profileResult.success
                    ? "bg-emerald-900/20 border-emerald-700/30 text-emerald-300"
                    : "bg-red-900/20 border-red-700/30 text-red-300"
                }`}
              >
                {profileResult.success && <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />}
                {profileResult.message}
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:border-[#dc143c]/50 focus:ring-1 focus:ring-[#dc143c]/20 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2.5 text-slate-500 text-sm cursor-not-allowed"
                />
                <p className="text-slate-600 text-xs mt-1">Email cannot be changed. Contact support for assistance.</p>
              </div>
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={savingProfile || !name.trim()}
                  className="flex items-center gap-2 bg-[#dc143c] hover:bg-[#c41232] disabled:bg-white/[0.08] disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {tab === "security" && (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-6">
            <h2 className="text-white font-semibold mb-1">Change Password</h2>
            <p className="text-slate-400 text-sm mb-5">Use a strong password with at least 8 characters.</p>
            {passwordResult && (
              <div
                className={`mb-4 flex items-start gap-2 rounded-lg p-3 text-sm border ${
                  passwordResult.success
                    ? "bg-emerald-900/20 border-emerald-700/30 text-emerald-300"
                    : "bg-red-900/20 border-red-700/30 text-red-300"
                }`}
              >
                {passwordResult.success && <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />}
                {passwordResult.message}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:border-[#dc143c]/50 focus:ring-1 focus:ring-[#dc143c]/20 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:border-[#dc143c]/50 focus:ring-1 focus:ring-[#dc143c]/20 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:border-[#dc143c]/50 focus:ring-1 focus:ring-[#dc143c]/20 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="flex items-center gap-2 bg-[#dc143c] hover:bg-[#c41232] disabled:bg-white/[0.08] disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
