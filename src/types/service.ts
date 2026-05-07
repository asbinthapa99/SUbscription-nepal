export type ServiceCategory =
  | "chat"
  | "content"
  | "coding"
  | "automation"
  | "image"
  | "api"
  | "custom";

export type AiService = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startingPriceNpr: number;
  category: ServiceCategory;
  includedTools: string[];
  isFeatured: boolean;
  cta: string;
};
