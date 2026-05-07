"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const suggestions = ["Which plan is best?", "Do you support Khalti?", "Can I buy AI services?"];

export function FloatingChatbox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 md:bottom-5 right-4 md:right-5 z-50">
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-border/70 bg-background/90 backdrop-blur-xl shadow-2xl shadow-slate-950/20 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm">FlowAI support</p>
                <p className="text-xs text-muted-foreground">Plan and service help</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="rounded-lg bg-muted px-3 py-2 text-sm">
              Hi. I can help you choose a plan, understand payments, or request an AI service.
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-[#dc143c]/40"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Type your question..."
              className="min-h-20 resize-none bg-background"
            />
            <div className="flex items-center gap-2">
              <Link
                href="/pricing"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
              >
                View pricing
              </Link>
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "sm" }), "gradient-primary text-white")}
              >
                <Send className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="h-14 w-14 rounded-full gradient-primary text-white shadow-xl shadow-[#dc143c]/30 flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Open support chat"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}
