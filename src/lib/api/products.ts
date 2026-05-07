import { apiFetch } from "./client";

export interface ProductDuration {
  label: string;
  months: number;
  priceNpr: number;
  popular?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  provider: string;
  description: string;
  category: string;
  accent: string;
  rgb: string;
  badge: string | null;
  isFeatured: boolean;
  isActive: boolean;
  durations: ProductDuration[];
  features: string[];
  sortOrder: number;
}

export const getPublicProducts = () =>
  apiFetch<{ products: Product[] }>("/api/products");

export const getAdminProducts = () =>
  apiFetch<{ products: Product[] }>("/api/admin/products");

export const upsertAdminProduct = (product: Partial<Product> & { slug: string }) =>
  apiFetch<{ product: Product }>("/api/admin/products", {
    method: "PUT",
    body: JSON.stringify(product),
  });
