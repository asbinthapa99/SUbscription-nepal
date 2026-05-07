import { PaymentProvider } from "@prisma/client";
import { z } from "zod";

const paymentProviderSchema = z.union([
  z.nativeEnum(PaymentProvider),
  z.enum(["esewa", "khalti", "imepay", "ESEWA", "KHALTI", "MANUAL"]),
]);

export const initiatePaymentSchema = z.object({
  productSlug: z.string().min(1),
  durationMonths: z.number().int().min(1).max(24),
  provider: paymentProviderSchema,
});

export const verifyPaymentSchema = z.object({
  paymentId: z.string().min(1),
  transactionId: z.string().min(3).max(120),
});
