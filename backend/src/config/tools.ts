export type AiToolConfig = {
  key: string;
  title: string;
  description: string;
  category: "chat" | "content" | "coding" | "automation" | "image" | "api";
  accent: string;
  href: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

export const aiTools: AiToolConfig[] = [
  {
    key: "ai-chat",
    title: "AI Chat",
    description: "ChatGPT-style workspace for study, writing, business planning, and support.",
    category: "chat",
    accent: "#dc143c",
    href: "/register?tool=ai-chat",
    isFeatured: true,
    isActive: true,
    sortOrder: 1
  },
  {
    key: "code-helper",
    title: "Code Helper",
    description: "Explain errors, generate snippets, review code, and plan technical tasks.",
    category: "coding",
    accent: "#1e6fbf",
    href: "/register?tool=code-helper",
    isFeatured: true,
    isActive: true,
    sortOrder: 2
  },
  {
    key: "content-writer",
    title: "Content Writer",
    description: "Create posts, emails, summaries, product copy, and campaign drafts.",
    category: "content",
    accent: "#10b981",
    href: "/register?tool=content-writer",
    isFeatured: true,
    isActive: true,
    sortOrder: 3
  },
  {
    key: "automation-planner",
    title: "Automation Planner",
    description: "Convert manual work into AI-assisted workflows and operating checklists.",
    category: "automation",
    accent: "#f59e0b",
    href: "/register?tool=automation-planner",
    isFeatured: false,
    isActive: true,
    sortOrder: 4
  },
  {
    key: "image-prompt-studio",
    title: "Image Prompt Studio",
    description: "Write precise prompts for product images, ads, concepts, and campaigns.",
    category: "image",
    accent: "#8b5cf6",
    href: "/register?tool=image-prompt-studio",
    isFeatured: false,
    isActive: true,
    sortOrder: 5
  },
  {
    key: "developer-api",
    title: "Developer API",
    description: "Use server-side API keys with plan limits, token controls, and NPR billing.",
    category: "api",
    accent: "#0ea5e9",
    href: "/register?tool=developer-api",
    isFeatured: false,
    isActive: true,
    sortOrder: 6
  }
];
