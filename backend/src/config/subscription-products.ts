export type ProductDuration = {
  months: number;
  priceNpr: number;
};

export type SubscriptionProduct = {
  slug: string;
  name: string;
  planType: string;
  durations: ProductDuration[];
};

const products: SubscriptionProduct[] = [
  {
    slug: "netflix",
    name: "Netflix",
    planType: "PREMIUM",
    durations: [
      { months: 1, priceNpr: 499 },
      { months: 3, priceNpr: 1299 },
      { months: 6, priceNpr: 2399 },
      { months: 12, priceNpr: 4499 },
    ],
  },
  {
    slug: "chatgpt-plus",
    name: "ChatGPT Plus",
    planType: "PREMIUM",
    durations: [
      { months: 1, priceNpr: 1799 },
      { months: 3, priceNpr: 4999 },
      { months: 6, priceNpr: 9499 },
    ],
  },
  {
    slug: "claude-pro",
    name: "Claude Pro",
    planType: "PREMIUM",
    durations: [
      { months: 1, priceNpr: 1799 },
      { months: 3, priceNpr: 4999 },
      { months: 6, priceNpr: 9499 },
    ],
  },
  {
    slug: "spotify",
    name: "Spotify Premium",
    planType: "PREMIUM",
    durations: [
      { months: 1, priceNpr: 299 },
      { months: 3, priceNpr: 799 },
      { months: 6, priceNpr: 1499 },
      { months: 12, priceNpr: 2799 },
    ],
  },
  {
    slug: "youtube-premium",
    name: "YouTube Premium",
    planType: "PREMIUM",
    durations: [
      { months: 1, priceNpr: 349 },
      { months: 3, priceNpr: 899 },
      { months: 12, priceNpr: 3299 },
    ],
  },
  {
    slug: "canva-pro",
    name: "Canva Pro",
    planType: "PREMIUM",
    durations: [
      { months: 1, priceNpr: 899 },
      { months: 3, priceNpr: 2399 },
      { months: 12, priceNpr: 7999 },
    ],
  },
  {
    slug: "nordvpn",
    name: "NordVPN",
    planType: "PREMIUM",
    durations: [
      { months: 1, priceNpr: 699 },
      { months: 3, priceNpr: 1799 },
      { months: 12, priceNpr: 5999 },
    ],
  },
  {
    slug: "duolingo-plus",
    name: "Duolingo Plus",
    planType: "PREMIUM",
    durations: [
      { months: 1, priceNpr: 249 },
      { months: 3, priceNpr: 649 },
      { months: 12, priceNpr: 2299 },
    ],
  },
];

const productMap = new Map(products.map((p) => [p.slug, p]));

export const getProductBySlug = (slug: string): SubscriptionProduct | undefined =>
  productMap.get(slug);

export const getProductPrice = (slug: string, months: number): number | undefined =>
  productMap.get(slug)?.durations.find((d) => d.months === months)?.priceNpr;
