import { apiFetch } from "./client";

export interface UsageSummary {
  usage: { promptsToday: number; tokensThisMonth: number; totalPrompts: number };
  limits: { dailyPromptLimit: number; monthlyTokenLimit: number } | null;
}

export const getUsageSummary = () => apiFetch<UsageSummary>("/api/usage/summary");
