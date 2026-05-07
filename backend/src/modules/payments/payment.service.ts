import { PaymentProvider, PaymentStatus, PlanType } from "@prisma/client";
import { prisma } from "../../db/prisma.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";
import { getProductBySlug, getProductPrice } from "../../config/subscription-products.js";
import { getPlanByType } from "../plans/plans.service.js";
import { activateSubscription } from "../subscriptions/subscription.service.js";
import { sendPaymentActivatedEmail, sendPaymentInitiatedEmail } from "../../utils/mailer.js";

const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const normalizeProvider = (provider: PaymentProvider | string): PaymentProvider => {
  switch (String(provider).toUpperCase()) {
    case "ESEWA":
      return PaymentProvider.ESEWA;
    case "KHALTI":
      return PaymentProvider.KHALTI;
    case "IMEPAY":
    case "CONNECTIPS":
    case "MANUAL":
    default:
      return PaymentProvider.MANUAL;
  }
};

const providerLabelMap: Record<PaymentProvider, string> = {
  [PaymentProvider.ESEWA]: "eSewa",
  [PaymentProvider.KHALTI]: "Khalti",
  [PaymentProvider.CONNECTIPS]: "ConnectIPS",
  [PaymentProvider.MANUAL]: "IME Pay",
};

const buildQrPayload = (input: {
  referenceCode: string;
  productName: string;
  durationMonths: number;
  providerLabel: string;
  amountNpr: number;
}) =>
  [
    "FlowAI Nepal Payment",
    `Reference: ${input.referenceCode}`,
    `Product: ${input.productName} (${input.durationMonths} month${input.durationMonths > 1 ? "s" : ""})`,
    `Provider: ${input.providerLabel}`,
    `Amount: NPR ${input.amountNpr.toLocaleString()}`,
  ].join("\n");

export const initiatePayment = async (input: {
  userId: string;
  productSlug: string;
  durationMonths: number;
  provider: PaymentProvider | string;
}) => {
  const product = getProductBySlug(input.productSlug);
  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  const priceNpr = getProductPrice(input.productSlug, input.durationMonths);
  if (!priceNpr) {
    throw new ApiError(400, "Duration not available for this product");
  }

  const provider = normalizeProvider(input.provider);
  const payment = await prisma.payment.create({
    data: {
      userId: input.userId,
      planType: (product.planType as PlanType) ?? PlanType.PREMIUM,
      productSlug: input.productSlug,
      durationMonths: input.durationMonths,
      provider,
      amountNpr: priceNpr,
      status: PaymentStatus.PENDING,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { name: true, email: true },
  });

  const referenceCode = `FAN-${payment.id.slice(-8).toUpperCase()}`;
  const providerLabel = providerLabelMap[provider];
  const productLabel = `${product.name} — ${input.durationMonths} month${input.durationMonths > 1 ? "s" : ""}`;
  const qrPayload = buildQrPayload({
    referenceCode,
    productName: product.name,
    durationMonths: input.durationMonths,
    providerLabel,
    amountNpr: priceNpr,
  });

  if (user) {
    await sendPaymentInitiatedEmail({
      to: user.email,
      name: user.name,
      planName: productLabel,
      amountNpr: priceNpr,
      providerLabel,
      referenceCode,
      qrPayload,
      billingUrl: `${env.FRONTEND_URL}/billing`,
    });
  }

  return {
    payment,
    checkout: {
      mode: "qr",
      referenceCode,
      providerLabel,
      qrPayload,
      message: "Scan the QR or use the reference code to complete your payment. An admin will verify within 24 hours.",
    },
  };
};

export const verifyManualPayment = async (input: {
  paymentId: string;
  transactionId: string;
  adminUserId: string;
}) => {
  const payment = await prisma.payment.findUnique({
    where: { id: input.paymentId },
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status === PaymentStatus.PAID) {
    throw new ApiError(409, "Payment is already verified");
  }

  const durationMonths = payment.durationMonths ?? 1;
  const expiresAt = addMonths(new Date(), durationMonths);

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.PAID,
      transactionId: input.transactionId,
      verifiedAt: new Date(),
    },
  });

  const subscription = await activateSubscription({
    userId: payment.userId,
    planType: payment.planType,
    productSlug: payment.productSlug ?? undefined,
    durationMonths,
    expiresAt,
  });

  const user = await prisma.user.findUnique({
    where: { id: payment.userId },
    select: { name: true, email: true },
  });

  if (user) {
    const product = payment.productSlug ? getProductBySlug(payment.productSlug) : null;
    const plan = product ? { name: product.name } : await getPlanByType(payment.planType);
    const productLabel = product
      ? `${product.name} (${durationMonths} month${durationMonths > 1 ? "s" : ""})`
      : (plan?.name ?? payment.planType);

    await sendPaymentActivatedEmail({
      to: user.email,
      name: user.name,
      planName: productLabel,
      expiresAt: subscription.expiresAt,
      billingUrl: `${env.FRONTEND_URL}/billing`,
    });
  }

  return { payment: updated, subscription };
};
