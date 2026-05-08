import { asyncHandler } from "../../utils/async-handler.js";
import { initiatePayment, verifyManualPayment } from "./payment.service.js";
import { initiatePaymentSchema, verifyPaymentSchema } from "./payment.validation.js";

export const createPayment = asyncHandler(async (req, res) => {
  const input = initiatePaymentSchema.parse(req.body);
  const result = await initiatePayment({
    userId: req.user!.id,
    productSlug: input.productSlug,
    durationMonths: input.durationMonths,
    provider: input.provider,
  });

  res.status(201).json(result);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const input = verifyPaymentSchema.parse(req.body);
  const result = await verifyManualPayment({
    paymentId: input.paymentId,
    transactionId: input.transactionId,
    adminUserId: req.user!.id,
  });

  res.json(result);
});
