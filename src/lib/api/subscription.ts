import { apiFetch } from "./client";

export interface Subscription {
  planType: string;
  productSlug: string | null;
  durationMonths: number;
  status: string;
  expiresAt: string;
}

export interface BillingPayment {
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
  updatedAt: string;
}

export interface BillingOverview {
  subscription: Subscription | null;
  payments: BillingPayment[];
}

export interface InitiatePaymentCheckout {
  mode: string;
  referenceCode: string;
  providerLabel: string;
  qrPayload: string;
  message: string;
}

export interface InitiatePaymentResult {
  payment: {
    id: string;
    amountNpr: number;
    status: string;
  };
  checkout: InitiatePaymentCheckout;
}

const providerMap: Record<string, string> = {
  esewa: "ESEWA",
  khalti: "KHALTI",
  imepay: "MANUAL",
};

export const getSubscription = () =>
  apiFetch<{ subscription: Subscription | null }>("/api/subscription");

export const getBillingOverview = () =>
  apiFetch<BillingOverview>("/api/subscription/billing");

export const initiatePayment = (productSlug: string, durationMonths: number, provider: string) =>
  apiFetch<InitiatePaymentResult>("/api/payments/initiate", {
    method: "POST",
    body: JSON.stringify({
      productSlug,
      durationMonths,
      provider: providerMap[provider] ?? provider.toUpperCase(),
    }),
  });
