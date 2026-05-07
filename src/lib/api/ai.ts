import { apiFetch } from "./client";

export interface ChatResponse {
  response: string;
  model: string;
  usage: { totalTokens: number };
}

export const sendChat = (prompt: string, model?: string) =>
  apiFetch<ChatResponse>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({ prompt, model }),
  });
