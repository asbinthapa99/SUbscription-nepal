import { PrismaClient } from "@prisma/client";
import { plans } from "../src/config/plans.js";
import { servicePackages } from "../src/config/services.js";
import { aiTools } from "../src/config/tools.js";

const prisma = new PrismaClient();

const main = async () => {
  for (const plan of Object.values(plans)) {
    await prisma.plan.upsert({
      where: {
        planType: plan.id
      },
      create: {
        planType: plan.id,
        name: plan.name,
        description: plan.description,
        priceNpr: plan.priceNpr,
        dailyPromptLimit: plan.dailyPromptLimit,
        monthlyTokenLimit: plan.monthlyTokenLimit,
        allowedModels: plan.allowedModels,
        includedTools: plan.includedTools,
        badge: plan.badge,
        isPublic: plan.isPublic,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder
      },
      update: {
        name: plan.name,
        description: plan.description,
        priceNpr: plan.priceNpr,
        dailyPromptLimit: plan.dailyPromptLimit,
        monthlyTokenLimit: plan.monthlyTokenLimit,
        allowedModels: plan.allowedModels,
        includedTools: plan.includedTools,
        badge: plan.badge,
        isPublic: plan.isPublic,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder
      }
    });
  }

  for (const service of servicePackages) {
    await prisma.aiServicePackage.upsert({
      where: {
        slug: service.slug
      },
      create: {
        title: service.title,
        slug: service.slug,
        description: service.description,
        category: service.category,
        startingPriceNpr: service.startingPriceNpr,
        includedTools: service.includedTools,
        isFeatured: service.isFeatured,
        isActive: service.isActive,
        sortOrder: service.sortOrder
      },
      update: {
        title: service.title,
        description: service.description,
        category: service.category,
        startingPriceNpr: service.startingPriceNpr,
        includedTools: service.includedTools,
        isFeatured: service.isFeatured,
        isActive: service.isActive,
        sortOrder: service.sortOrder
      }
    });
  }

  for (const tool of aiTools) {
    await prisma.aiTool.upsert({
      where: {
        key: tool.key
      },
      create: tool,
      update: tool
    });
  }

  // Subscription products
  const subscriptionProducts = [
    {
      slug: "netflix",
      name: "Netflix",
      provider: "Netflix",
      description: "Stream movies and TV shows in HD and 4K.",
      category: "streaming",
      accent: "#E50914",
      rgb: "229,9,20",
      badge: "Best seller",
      isFeatured: true,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 499 },
        { label: "3 Months", months: 3, priceNpr: 1299, popular: true },
        { label: "6 Months", months: 6, priceNpr: 2399 },
        { label: "12 Months", months: 12, priceNpr: 4499 },
      ],
      features: ["HD/4K streaming", "Multiple screens", "Download offline", "All devices"],
      sortOrder: 0,
    },
    {
      slug: "spotify",
      name: "Spotify Premium",
      provider: "Spotify",
      description: "Ad-free music streaming with offline downloads.",
      category: "music",
      accent: "#1DB954",
      rgb: "29,185,84",
      badge: null,
      isFeatured: true,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 299 },
        { label: "3 Months", months: 3, priceNpr: 799, popular: true },
        { label: "6 Months", months: 6, priceNpr: 1499 },
        { label: "12 Months", months: 12, priceNpr: 2799 },
      ],
      features: ["Ad-free music", "Offline downloads", "High quality audio", "All devices"],
      sortOrder: 1,
    },
    {
      slug: "youtube-premium",
      name: "YouTube Premium",
      provider: "Google",
      description: "Ad-free YouTube with background play and YouTube Music.",
      category: "streaming",
      accent: "#FF0000",
      rgb: "255,0,0",
      badge: null,
      isFeatured: true,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 349 },
        { label: "3 Months", months: 3, priceNpr: 899, popular: true },
        { label: "12 Months", months: 12, priceNpr: 3299 },
      ],
      features: ["No ads", "Background play", "YouTube Music", "Offline downloads"],
      sortOrder: 2,
    },
    {
      slug: "chatgpt-plus",
      name: "ChatGPT Plus",
      provider: "OpenAI",
      description: "Access GPT-4o, DALL-E image generation and advanced analysis.",
      category: "ai",
      accent: "#10a37f",
      rgb: "16,163,127",
      badge: "Most popular",
      isFeatured: true,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 1799 },
        { label: "3 Months", months: 3, priceNpr: 4999, popular: true },
        { label: "6 Months", months: 6, priceNpr: 9499 },
      ],
      features: ["GPT-4o access", "DALL-E image gen", "Advanced analysis", "Priority speed"],
      sortOrder: 3,
    },
    {
      slug: "claude-pro",
      name: "Claude Pro",
      provider: "Anthropic",
      description: "Access Claude 3.5 Sonnet and Claude 3 Opus with priority bandwidth.",
      category: "ai",
      accent: "#D4693A",
      rgb: "212,105,58",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 1799 },
        { label: "3 Months", months: 3, priceNpr: 4999, popular: true },
        { label: "6 Months", months: 6, priceNpr: 9499 },
      ],
      features: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Priority bandwidth", "Projects & folders"],
      sortOrder: 4,
    },
    {
      slug: "gemini-advanced",
      name: "Gemini Advanced",
      provider: "Google",
      description: "Access Gemini Ultra with Google Workspace integration.",
      category: "ai",
      accent: "#8E75B2",
      rgb: "142,117,178",
      badge: null,
      isFeatured: true,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 1799 },
        { label: "3 Months", months: 3, priceNpr: 4999, popular: true },
        { label: "6 Months", months: 6, priceNpr: 9499 },
      ],
      features: ["Gemini Ultra access", "Google Workspace integration", "Advanced reasoning", "Priority access"],
      sortOrder: 5,
    },
    {
      slug: "perplexity-pro",
      name: "Perplexity Pro",
      provider: "Perplexity AI",
      description: "Unlimited Pro searches with GPT-4o, Claude and file uploads.",
      category: "ai",
      accent: "#1FB8CD",
      rgb: "31,184,205",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 1299 },
        { label: "3 Months", months: 3, priceNpr: 3499, popular: true },
        { label: "12 Months", months: 12, priceNpr: 11999 },
      ],
      features: ["Unlimited Pro searches", "GPT-4o & Claude", "File uploads", "API access"],
      sortOrder: 6,
    },
    {
      slug: "midjourney",
      name: "Midjourney",
      provider: "Midjourney",
      description: "AI image generation with 200 images/month and commercial license.",
      category: "ai",
      accent: "#000000",
      rgb: "0,0,0",
      badge: null,
      isFeatured: true,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 1499 },
        { label: "3 Months", months: 3, priceNpr: 3999, popular: true },
        { label: "12 Months", months: 12, priceNpr: 13999 },
      ],
      features: ["AI image generation", "200 images/month", "Commercial license", "Discord access"],
      sortOrder: 7,
    },
    {
      slug: "canva-pro",
      name: "Canva Pro",
      provider: "Canva",
      description: "Premium design templates, brand kit and AI design tools.",
      category: "productivity",
      accent: "#8B3DFF",
      rgb: "139,61,255",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 899 },
        { label: "3 Months", months: 3, priceNpr: 2399, popular: true },
        { label: "12 Months", months: 12, priceNpr: 7999 },
      ],
      features: ["Premium templates", "Brand kit", "Background remover", "AI design tools"],
      sortOrder: 8,
    },
    {
      slug: "grammarly-premium",
      name: "Grammarly Premium",
      provider: "Grammarly",
      description: "Advanced grammar, tone detection and plagiarism checker.",
      category: "productivity",
      accent: "#15C39A",
      rgb: "21,195,154",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 799 },
        { label: "3 Months", months: 3, priceNpr: 1999, popular: true },
        { label: "12 Months", months: 12, priceNpr: 6999 },
      ],
      features: ["Advanced grammar", "Tone detection", "Plagiarism checker", "AI writing"],
      sortOrder: 9,
    },
    {
      slug: "notion-ai",
      name: "Notion AI",
      provider: "Notion",
      description: "AI writing assistant with unlimited blocks and team collaboration.",
      category: "productivity",
      accent: "#000000",
      rgb: "0,0,0",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 599 },
        { label: "3 Months", months: 3, priceNpr: 1599, popular: true },
        { label: "12 Months", months: 12, priceNpr: 5499 },
      ],
      features: ["AI writing assistant", "Unlimited blocks", "Team collaboration", "Templates"],
      sortOrder: 10,
    },
    {
      slug: "nordvpn",
      name: "NordVPN",
      provider: "Nord Security",
      description: "Fast VPN with 6 devices, no logs and malware protection.",
      category: "productivity",
      accent: "#4687FF",
      rgb: "70,135,255",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 699 },
        { label: "3 Months", months: 3, priceNpr: 1799, popular: true },
        { label: "12 Months", months: 12, priceNpr: 5999 },
      ],
      features: ["6 devices", "No logs", "Malware protection", "Fast servers"],
      sortOrder: 11,
    },
    {
      slug: "disney-plus",
      name: "Disney+",
      provider: "Disney",
      description: "Stream Disney, Pixar, Marvel, Star Wars and National Geographic.",
      category: "streaming",
      accent: "#113CCF",
      rgb: "17,60,207",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 499 },
        { label: "3 Months", months: 3, priceNpr: 1299, popular: true },
        { label: "12 Months", months: 12, priceNpr: 4299 },
      ],
      features: ["Disney & Pixar", "Marvel", "Star Wars", "National Geographic", "Offline downloads"],
      sortOrder: 12,
    },
    {
      slug: "amazon-prime",
      name: "Amazon Prime Video",
      provider: "Amazon",
      description: "Prime Originals and 4K streaming with offline downloads.",
      category: "streaming",
      accent: "#00A8E0",
      rgb: "0,168,224",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 399 },
        { label: "3 Months", months: 3, priceNpr: 999, popular: true },
        { label: "12 Months", months: 12, priceNpr: 3499 },
      ],
      features: ["Prime Originals", "4K streaming", "Offline downloads", "Multiple screens"],
      sortOrder: 13,
    },
    {
      slug: "duolingo-plus",
      name: "Duolingo Plus",
      provider: "Duolingo",
      description: "Ad-free language learning with unlimited hearts and offline lessons.",
      category: "education",
      accent: "#58CC02",
      rgb: "88,204,2",
      badge: null,
      isFeatured: false,
      isActive: true,
      durations: [
        { label: "1 Month", months: 1, priceNpr: 249 },
        { label: "3 Months", months: 3, priceNpr: 649, popular: true },
        { label: "12 Months", months: 12, priceNpr: 2299 },
      ],
      features: ["No ads", "Unlimited hearts", "Offline lessons", "Progress tracking"],
      sortOrder: 14,
    },
  ];

  for (const product of subscriptionProducts) {
    const { slug, durations, features, ...rest } = product;
    await prisma.subscriptionProduct.upsert({
      where: { slug },
      create: { slug, durations, features, ...rest },
      update: { durations, features, ...rest },
    });
  }

  // Site content
  const siteContent = [
    { key: "hero.badge", label: "Badge text", value: "Nepal's #1 Subscription Reseller", section: "hero" },
    { key: "hero.headline", label: "Hero headline", value: "Premium subscriptions\nat Nepali prices", section: "hero" },
    { key: "hero.subtitle", label: "Hero subtitle", value: "Get Netflix, Spotify, ChatGPT and more — paid in NPR via eSewa, Khalti, or IME Pay. Delivered same day.", section: "hero" },
    { key: "contact.whatsapp", label: "WhatsApp number", value: "+977 98XXXXXXXX", section: "contact" },
    { key: "contact.email", label: "Support email", value: "support@flowainepal.com", section: "contact" },
    { key: "site.name", label: "Site name", value: "FlowAI Nepal", section: "general" },
  ];

  for (const item of siteContent) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      create: item,
      update: { label: item.label, value: item.value, section: item.section },
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
