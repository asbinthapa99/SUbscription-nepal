"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Bot, User as UserIcon, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { sendChat } from "@/lib/api/ai";

type Model = "gpt-4o" | "gpt-4o-mini";

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
  error?: boolean;
}

const MODEL_LABELS: Record<Model, string> = {
  "gpt-4o": "GPT-4o",
  "gpt-4o-mini": "GPT-4o Mini",
};

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState<Model>("gpt-4o");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend() {
    const prompt = input.trim();
    if (!prompt || sending) return;

    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      const res = await sendChat(prompt, model);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.response, model: res.model },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: msg, error: true },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px-48px)] md:h-[calc(100vh-64px-48px)]">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h1 className="text-white font-bold text-lg">AI Chat</h1>
            <p className="text-slate-500 text-xs">Powered by FlowAI Nepal</p>
          </div>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelMenu((v) => !v)}
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <Bot className="w-4 h-4 text-[#dc143c]" />
              {MODEL_LABELS[model]}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showModelMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-[#0d1526] border border-white/[0.1] rounded-xl shadow-xl z-50 overflow-hidden">
                {(Object.keys(MODEL_LABELS) as Model[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setModel(m); setShowModelMenu(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                      model === m
                        ? "bg-[#dc143c]/10 text-[#dc143c]"
                        : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {model === m && <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c]" />}
                    {model !== m && <span className="w-1.5 h-1.5" />}
                    {MODEL_LABELS[m]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4"
          onClick={() => setShowModelMenu(false)}
        >
          {messages.length === 0 && !sending && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#dc143c]/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-[#dc143c]" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg mb-1">Ask anything</h2>
                <p className="text-slate-400 text-sm max-w-xs">
                  Ask anything in Nepali or English — GPT-4o responds instantly.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 w-full max-w-sm">
                {[
                  "Explain quantum computing simply",
                  "Write a poem in Nepali",
                  "What is machine learning?",
                  "Help me write an email",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-left p-3 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 text-xs transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-[#dc143c]/20 text-[#dc143c]"
                    : "bg-[#1e6fbf]/20 text-[#1e6fbf]"
                }`}
              >
                {msg.role === "user"
                  ? (user?.name?.charAt(0).toUpperCase() ?? "U")
                  : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#dc143c]/15 text-white rounded-tr-none border border-[#dc143c]/20"
                    : msg.error
                    ? "bg-red-900/20 text-red-400 border border-red-800/30 rounded-tl-none"
                    : "bg-white/[0.06] text-slate-200 border border-white/[0.08] rounded-tl-none"
                }`}
              >
                {msg.role === "assistant" && msg.model && !msg.error && (
                  <div className="text-[#1e6fbf] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                    {msg.model}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {/* Loading bubble */}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-[#1e6fbf]/20 text-[#1e6fbf]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-none px-4 py-3">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0">
          <div className="flex items-end gap-3 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              placeholder="Type your message… (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none outline-none max-h-40 leading-relaxed"
              style={{ minHeight: "24px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-9 h-9 rounded-lg bg-[#dc143c] hover:bg-[#c41232] disabled:bg-white/[0.08] disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <p className="text-slate-600 text-xs text-center mt-2">
            FlowAI Nepal · AI responses may not always be accurate.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
