import { servicePackages } from "../../config/services.js";
import { prisma } from "../../db/prisma.js";

const ctaBySlug = new Map(servicePackages.map((service) => [service.slug, service.cta]));

export const listPublicServices = async () => {
  const dbServices = await prisma.aiServicePackage
    .findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: "asc"
      }
    })
    .catch(() => []);

  if (dbServices.length > 0) {
    return dbServices.map((service) => ({
      ...service,
      cta: ctaBySlug.get(service.slug) ?? "Request service"
    }));
  }

  return servicePackages;
};

export const getPublicServiceBySlug = async (slug: string) => {
  const dbService = await prisma.aiServicePackage
    .findUnique({
      where: { slug }
    })
    .catch(() => null);

  if (dbService?.isActive) {
    return {
      ...dbService,
      cta: ctaBySlug.get(dbService.slug) ?? "Request service"
    };
  }

  return servicePackages.find((service) => service.slug === slug && service.isActive) ?? null;
};
