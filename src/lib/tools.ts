import { Bot, Code2, FileText, Image, KeyRound, Workflow } from "lucide-react";
import type { AiTool } from "@/types/tool";

export const aiTools: AiTool[] = [
  {
    id: "ai-chat",
    title: "AI Chat",
    description: "ChatGPT-style workspace for study, writing, business planning, and support.",
    icon: Bot,
    accent: "#dc143c",
    href: "/register?tool=ai-chat",
  },
  {
    id: "code-helper",
    title: "Code Helper",
    description: "Explain errors, generate snippets, review code, and plan technical tasks.",
    icon: Code2,
    accent: "#1e6fbf",
    href: "/register?tool=code-helper",
  },
  {
    id: "content-writer",
    title: "Content Writer",
    description: "Create posts, emails, summaries, product copy, and campaign drafts.",
    icon: FileText,
    accent: "#10b981",
    href: "/register?tool=content-writer",
  },
  {
    id: "automation-planner",
    title: "Automation Planner",
    description: "Convert manual work into AI-assisted workflows and operating checklists.",
    icon: Workflow,
    accent: "#f59e0b",
    href: "/register?tool=automation-planner",
  },
  {
    id: "image-prompt-studio",
    title: "Image Prompt Studio",
    description: "Write precise prompts for product images, ads, concepts, and campaigns.",
    icon: Image,
    accent: "#8b5cf6",
    href: "/register?tool=image-prompt-studio",
  },
  {
    id: "developer-api",
    title: "Developer API",
    description: "Use server-side API keys with plan limits, token controls, and NPR billing.",
    icon: KeyRound,
    accent: "#0ea5e9",
    href: "/register?tool=developer-api",
  },
];
