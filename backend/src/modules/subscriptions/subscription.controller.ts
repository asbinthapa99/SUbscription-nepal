import { asyncHandler } from "../../utils/async-handler.js";
import { prisma } from "../../db/prisma.js";
import { getActiveSubscription } from "./subscription.service.js";

export const getCurrentSubscription = asyncHandler(async (req, res) => {
  const subscription = await getActiveSubscription(req.user!.id);

  res.json({ subscription });
});

export const getBillingOverview = asyncHandler(async (req, res) => {
  const [subscription, payments] = await Promise.all([
    getActiveSubscription(req.user!.id),
    prisma.payment.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        planType: true,
        productSlug: true,
        durationMonths: true,
        provider: true,
        amountNpr: true,
        status: true,
        transactionId: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  res.json({ subscription, payments });
});

