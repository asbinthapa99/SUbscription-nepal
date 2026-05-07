import { apiFetch } from "./client";

export interface SiteContentItem {
  id: string;
  key: string;
  label: string;
  value: string;
  section: string;
}

export const getAdminContent = () =>
  apiFetch<{ content: SiteContentItem[] }>("/api/admin/content");

export const updateAdminContent = (key: string, value: string) =>
  apiFetch<{ item: SiteContentItem }>(`/api/admin/content/${encodeURIComponent(key)}`, {
    method: "PATCH",
    body: JSON.stringify({ value }),
  });
