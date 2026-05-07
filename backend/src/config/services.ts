export type ServicePackageConfig = {
  title: string;
  slug: string;
  description: string;
  category: "chat" | "content" | "coding" | "automation" | "image" | "api" | "custom";
  startingPriceNpr: number;
  includedTools: string[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  cta: string;
};

export const servicePackages: ServicePackageConfig[] = [
  {
    title: "AI Chat Subscription",
    slug: "ai-chat-subscription",
    description: "Managed ChatGPT-style access with usage limits, billing, and support.",
    category: "chat",
    startingPriceNpr: 999,
    includedTools: ["GPT-4o", "Claude", "Conversation history"],
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
    cta: "View plans"
  },
  {
    title: "Assignment and Research Help",
    slug: "assignment-research",
    description: "Structured research, outlines, summaries, and study support.",
    category: "content",
    startingPriceNpr: 499,
    includedTools: ["Research assistant", "Summarizer", "Citation helper"],
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
    cta: "Request service"
  },
  {
    title: "Coding Assistant",
    slug: "coding-assistant",
    description: "Debugging, code review, scripts, and developer workflow support.",
    category: "coding",
    startingPriceNpr: 799,
    includedTools: ["Code helper", "Bug explainer", "API assistant"],
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
    cta: "Start coding"
  },
  {
    title: "Business Automation",
    slug: "business-automation",
    description: "Automate repeated business tasks with AI workflows and integrations.",
    category: "automation",
    startingPriceNpr: 4999,
    includedTools: ["Workflow design", "Chatbot setup", "Admin handoff"],
    isFeatured: false,
    isActive: true,
    sortOrder: 4,
    cta: "Discuss project"
  },
  {
    title: "Developer API Access",
    slug: "developer-api",
    description: "Server-side AI API access with NPR billing and monthly usage tracking.",
    category: "api",
    startingPriceNpr: 1499,
    includedTools: ["API keys", "Usage dashboard", "Rate limits"],
    isFeatured: false,
    isActive: true,
    sortOrder: 5,
    cta: "Get API access"
  },
  {
    title: "Custom Chatbot Setup",
    slug: "custom-chatbot",
    description: "A branded chatbot for websites, support, lead capture, or internal teams.",
    category: "custom",
    startingPriceNpr: 9999,
    includedTools: ["Knowledge base", "Widget setup", "Deployment support"],
    isFeatured: false,
    isActive: true,
    sortOrder: 6,
    cta: "Book setup"
  }
];
