import { asyncHandler } from "../../utils/async-handler.js";
import { prisma } from "../../db/prisma.js";
import { upsertPlanSchema, upsertServiceSchema, upsertToolSchema } from "./admin.validation.js";
import { verifyManualPayment } from "../payments/payment.service.js";

const parsePagination = (query: Record<string, unknown>) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return { skip: (page - 1) * limit, take: limit, page, limit };
};

export const adminSummary = asyncHandler(async (_req, res) => {
  const [users, activeSubscriptions, pendingPayments, usage] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({
      where: { status: { in: ["ACTIVE", "TRIAL"] }, expiresAt: { gt: new Date() } }
    }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.usageLog.aggregate({ _sum: { totalTokens: true, requestCount: true } })
  ]);

  res.json({
    users,
    activeSubscriptions,
    pendingPayments,
    usage: {
      totalTokens: usage._sum.totalTokens ?? 0,
      requestCount: usage._sum.requestCount ?? 0
    }
  });
});

export const listAdminPlans = asyncHandler(async (_req, res) => {
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });
  res.json({ plans });
});

export const upsertAdminPlan = asyncHandler(async (req, res) => {
  const input = upsertPlanSchema.parse(req.body);
  const plan = await prisma.plan.upsert({
    where: { planType: input.planType },
    create: { ...input, allowedModels: input.allowedModels, includedTools: input.includedTools },
    update: { ...input, allowedModels: input.allowedModels, includedTools: input.includedTools }
  });
  res.json({ plan });
});

export const listAdminServices = asyncHandler(async (_req, res) => {
  const services = await prisma.aiServicePackage.findMany({ orderBy: { sortOrder: "asc" } });
  res.json({ services });
});

export const listAdminUsers = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = parsePagination(req.query as Record<string, unknown>);
  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        subscriptions: { orderBy: { expiresAt: "desc" }, take: 1 },
        _count: { select: { payments: true, usageLogs: true } }
      }
    })
  ]);
  res.json({ users, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const listAdminSubscriptions = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = parsePagination(req.query as Record<string, unknown>);
  const [total, subscriptions] = await Promise.all([
    prisma.subscription.count(),
    prisma.subscription.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } }
    })
  ]);
  res.json({ subscriptions, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const listAdminPayments = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = parsePagination(req.query as Record<string, unknown>);
  const [total, payments] = await Promise.all([
    prisma.payment.count(),
    prisma.payment.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } }
    })
  ]);
  res.json({ payments, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const listAdminUsage = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = parsePagination(req.query as Record<string, unknown>);
  const [total, usageLogs] = await Promise.all([
    prisma.usageLog.count(),
    prisma.usageLog.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } }
    })
  ]);
  res.json({ usageLogs, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const upsertAdminService = asyncHandler(async (req, res) => {
  const input = upsertServiceSchema.parse(req.body);
  const service = await prisma.aiServicePackage.upsert({
    where: { slug: input.slug },
    create: { ...input, includedTools: input.includedTools },
    update: { ...input, includedTools: input.includedTools }
  });
  res.json({ service });
});

export const listAdminTools = asyncHandler(async (_req, res) => {
  const tools = await prisma.aiTool.findMany({ orderBy: { sortOrder: "asc" } });
  res.json({ tools });
});

export const upsertAdminTool = asyncHandler(async (req, res) => {
  const input = upsertToolSchema.parse(req.body);
  const tool = await prisma.aiTool.upsert({ where: { key: input.key }, create: input, update: input });
  res.json({ tool });
});

export const listAdminProducts = asyncHandler(async (_req, res) => {
  const products = await prisma.subscriptionProduct.findMany({ orderBy: { sortOrder: "asc" } });
  res.json({ products });
});

export const upsertAdminProduct = asyncHandler(async (req, res) => {
  const { slug, ...data } = req.body as {
    slug: string;
    name: string;
    provider: string;
    description: string;
    category: string;
    accent: string;
    rgb: string;
    badge?: string;
    isFeatured?: boolean;
    isActive?: boolean;
    durations: import("@prisma/client").Prisma.InputJsonValue;
    features: import("@prisma/client").Prisma.InputJsonValue;
    sortOrder?: number;
  };
  const product = await prisma.subscriptionProduct.upsert({
    where: { slug },
    create: { slug, ...data },
    update: data,
  });
  res.json({ product });
});

export const listAdminContent = asyncHandler(async (_req, res) => {
  const content = await prisma.siteContent.findMany({
    orderBy: [{ section: "asc" }, { key: "asc" }],
  });
  res.json({ content });
});

export const updateAdminContent = asyncHandler(async (req, res) => {
  const { value } = req.body as { value: string };
  const item = await prisma.siteContent.update({ where: { key: String(req.params.key) }, data: { value } });
  res.json({ item });
});

export const verifyAdminPayment = asyncHandler(async (req, res) => {
  const { transactionId } = req.body as { transactionId?: string };
  if (!transactionId || transactionId.trim().length < 3) {
    res.status(400).json({ error: "transactionId is required (min 3 chars)" });
    return;
  }
  const paymentId = String(req.params.id);
  const result = await verifyManualPayment({
    paymentId,
    transactionId: transactionId.trim(),
    adminUserId: req.user!.id,
  });
  res.json(result);
});
