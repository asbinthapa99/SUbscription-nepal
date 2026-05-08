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
  subscriptions: { planType: string; status: string; expiresAt: string; productSlug: string | null }[];
  _count: { payments: number; usageLogs: number };
}

export interface AdminSubscription {
  id: string;
  planType: string;
  productSlug: string | null;
  status: string;
  durationMonths: number;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

export interface AdminContent {
  id: string;
  section: string;
  key: string;
  value: string;
  updatedAt: string;
}

export interface AdminPlan {
  id: string;
  planType: string;
  name: string;
  priceNpr: number;
  dailyPromptLimit: number;
  monthlyTokenLimit: number;
  isActive: boolean;
}

export interface PaginationMeta { total: number; page: number; limit: number; pages: number; }

export const getAdminSummary = () => apiFetch<AdminSummary>("/api/admin/summary");

export const getAdminPayments = (page = 1, limit = 20) =>
  apiFetch<{ payments: AdminPayment[]; meta: PaginationMeta }>(`/api/admin/payments?page=${page}&limit=${limit}`);

export const getAdminUsers = (page = 1, limit = 20) =>
  apiFetch<{ users: AdminUser[]; meta: PaginationMeta }>(`/api/admin/users?page=${page}&limit=${limit}`);

export const getAdminSubscriptions = (page = 1, limit = 20) =>
  apiFetch<{ subscriptions: AdminSubscription[]; meta: PaginationMeta }>(`/api/admin/subscriptions?page=${page}&limit=${limit}`);

export const getAdminPlans = () => apiFetch<{ plans: AdminPlan[] }>("/api/admin/plans");

export const verifyAdminPayment = (paymentId: string, transactionId: string) =>
  apiFetch<{ payment: AdminPayment }>(`/api/admin/payments/${paymentId}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ transactionId }),
  });

export const getAdminContent = () => apiFetch<{ content: AdminContent[] }>("/api/admin/content");

export const updateAdminContent = (key: string, value: string) =>
  apiFetch<{ item: AdminContent }>(`/api/admin/content/${key}`, {
    method: "PATCH",
    body: JSON.stringify({ value }),
  });
