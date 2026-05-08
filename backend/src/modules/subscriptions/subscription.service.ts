import type { PlanType } from "@prisma/client";
import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "../../db/prisma.js";
import { ApiError } from "../../utils/api-error.js";

export const getActiveSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL]
      },
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      expiresAt: "desc"
    }
  });

  return subscription;
};

export const requireActiveSubscription = async (userId: string) => {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    throw new ApiError(402, "Active subscription required");
  }

  return subscription;
};

export const activateSubscription = async (input: {
  userId: string;
  planType: PlanType;
  productSlug?: string;
  durationMonths?: number;
  startsAt?: Date;
  expiresAt: Date;
}) => {
  return prisma.$transaction(async (tx) => {
    await tx.subscription.updateMany({
      where: {
        userId: input.userId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] }
      },
      data: { status: SubscriptionStatus.CANCELLED }
    });

    return tx.subscription.create({
      data: {
        userId: input.userId,
        planType: input.planType,
        productSlug: input.productSlug ?? null,
        durationMonths: input.durationMonths ?? 1,
        startsAt: input.startsAt ?? new Date(),
        expiresAt: input.expiresAt,
        status: SubscriptionStatus.ACTIVE,
      },
    });
  });
};

