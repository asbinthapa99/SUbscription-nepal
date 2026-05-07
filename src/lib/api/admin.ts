import { apiFetch } from "./client";

export interface AdminSummary {
  users: number;
  activeSubscriptions: number;
  pendingPayments: number;
  usage: { totalTokens: number; requestCount: number };
}

export interface AdminPayment {
  id: string;
  planType: string;
  productSlug: string | null;
  durationMonths: number;
  provider: string;
  amountNpr: number;
  status: string;
  transactionId: string | null;
  verifiedAt: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  subscriptions: { planType: string; status: string; expiresAt: string }[];
  _count: { payments: number; usageLogs: number };
}

export const getAdminSummary = () =>
  apiFetch<AdminSummary>("/api/admin/summary");

export const getAdminPayments = () =>
  apiFetch<{ payments: AdminPayment[] }>("/api/admin/payments");

export const getAdminUsers = () =>
  apiFetch<{ users: AdminUser[] }>("/api/admin/users");

export const verifyAdminPayment = (paymentId: string, transactionId: string) =>
  apiFetch<{ payment: AdminPayment }>(`/api/admin/payments/${paymentId}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ transactionId }),
  });

export interface AdminContent {
  id: string;
  section: string;
  key: string;
  value: string;
  updatedAt: string;
}

export const getAdminContent = () =>
  apiFetch<{ content: AdminContent[] }>("/api/admin/content");

export const updateAdminContent = (key: string, value: string) =>
  apiFetch<{ item: AdminContent }>(`/api/admin/content/${key}`, {
    method: "PATCH",
    body: JSON.stringify({ value }),
  });

