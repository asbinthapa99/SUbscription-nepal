"use client";

import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does this work? Are these legitimate subscriptions?",
    answer: "Yes. We purchase genuine subscriptions in bulk and share access with you. You get a real account or profile slot — the same as buying directly, but priced in NPR.",
  },
  {
    question: "How do I pay? Do I need a dollar card?",
    answer: "No dollar card needed. Pay directly with eSewa, Khalti, or IME Pay in Nepali Rupees. Once payment is confirmed, we deliver your access within hours.",
  },
  {
    question: "How quickly do I get access after paying?",
    answer: "Most orders are delivered within 1–4 hours of payment confirmation. For some accounts, delivery is instant. We'll notify you via WhatsApp or email.",
  },
  {
    question: "What happens when my subscription expires?",
    answer: "You'll get a reminder 3–5 days before expiry. You can renew directly through us. If you don't renew, access will stop at the end of your paid period.",
  },
  {
    question: "Can I get a refund?",
    answer: "If there's an issue with your subscription (not working, wrong account, etc.) within 7 days of purchase, we'll replace it or refund you. No questions asked.",
  },
  {
    question: "Which subscriptions do you offer?",
    answer: "We currently offer Netflix, ChatGPT Plus, Claude Pro, Spotify Premium, YouTube Premium, Canva Pro, NordVPN, and Duolingo Plus. New platforms are added regularly.",
  },
  {
    question: "Do you offer shared or individual accounts?",
    answer: "Depending on the platform, we offer both. Netflix is typically screen-sharing (standard/premium plan). ChatGPT Plus and Claude Pro are individual accounts. Details are shown on each subscription page.",
  },
];

export function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="faq" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="animate-aurora absolute -bottom-24 -right-24 w-[400px] h-[400px]"
          style={{
            background: "radial-gradient(circle, rgba(30,111,191,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              color: "#8b5cf6",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
            FAQ
          </div>
          <h2
            className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-5 text-balance"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            Frequently asked questions
          </h2>
          <p
            className="text-muted-foreground text-lg"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 0.6s ease 0.1s",
            }}
          >
            Still have questions?{" "}
            <a
              href="mailto:support@flowainepal.com"
              className="font-semibold transition-colors"
              style={{ color: "#dc143c" }}
            >
              Contact us
            </a>
          </p>
        </div>

        <Accordion className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl px-6 border-0 overflow-hidden transition-all duration-300"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease ${index * 60 + 200}ms, transform 0.5s ease ${index * 60 + 200}ms`,
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              <AccordionTrigger className="font-semibold text-base text-left hover:no-underline py-5 text-foreground hover:text-[#dc143c] transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
