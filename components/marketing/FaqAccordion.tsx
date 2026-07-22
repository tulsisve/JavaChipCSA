"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utilities/cn";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-background-card">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-display text-base font-medium text-foreground">{item.question}</span>
              <ChevronDown
                className={cn("h-4 w-4 flex-shrink-0 text-foreground-muted transition-transform", isOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-foreground-muted">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
