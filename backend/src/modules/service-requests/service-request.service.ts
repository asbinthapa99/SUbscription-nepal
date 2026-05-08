import { prisma } from "../../db/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { getPublicServiceBySlug } from "../services/services.service.js";

export const createServiceRequest = async (input: {
  userId?: string;
  serviceSlug: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  budgetNpr?: number;
}) => {
  const service = await getPublicServiceBySlug(input.serviceSlug);

  if (!service) {
    throw new ApiError(404, "Service package not found");
  }

  return prisma.serviceRequest.create({
    data: {
      userId: input.userId,
      serviceSlug: input.serviceSlug,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      budgetNpr: input.budgetNpr
    }
  });
};

export const listServiceRequests = async () => {
  return prisma.serviceRequest.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const updateServiceRequestStatus = async (id: string, status: string) => {
  const existing = await prisma.serviceRequest.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new ApiError(404, "Service request not found");
  }

  return prisma.serviceRequest.update({
    where: { id },
    data: { status }
  });
};
