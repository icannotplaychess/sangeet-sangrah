"use client";

import { useMemo, useState } from "react";
import { facts } from "@/data/facts";
import type { FactCategory } from "@/data/types";

const categories: (FactCategory | "सर्व")[] = [
  "सर्व",
  "कलाकार",
  "गीते",
  "चित्रपट",
  "वाद्ये",
  "राग",
  "लोकसंगीत",
  "इतिहास",
  "कवी",
  "गीतकार",
  "संगीतकार",
];

export default function FactExplorer({ initialId }: { initialId?: string }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("सर्व");
  const pool = useMemo(
    () => (category === "सर्व" ? facts : facts.filter((f) => f.category === category)),
    [category],
  );
  const [index, setIndex] = useState(() => {
    const i = facts.findIndex((f) => f.id === initialId);
    return i >= 0 ? i : Math.floor(Math.random() * facts.length);
  });
  const [tick, setTick] = useState(0);

  const fact = pool[index % pool.length];

  function another() {
    if (pool.length <= 1) return;
    let next = index;
    while (next === index) {
      next = Math.floor(Math.random() * pool.length);
    }
    setIndex(next);
    setTick((t) => t + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              setIndex(0);
              setTick((t) => t + 1);
            }}
            className={`cursor-pointer rounded-full border px-4 py-1.5 font-label text-[9px] transition-colors ${
              c === category
                ? "border-teal-bright/70 text-teal-bright"
                : "hairline text-dim hover:text-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div key={tick} className="mt-14 animate-fade-up">
        <p className="font-label text-[9px] text-teal-bright">{fact.category}</p>
        <blockquote className="font-deva mt-6 border-l border-teal/40 pl-6 text-xl font-light leading-[2] text-pale md:pl-10 md:text-2xl md:leading-[2]">
          {fact.text}
        </blockquote>
      </div>

      <div className="mt-14">
        <button
          type="button"
          onClick={another}
          className="pill inline-flex cursor-pointer items-center gap-3 px-8 py-4 font-label text-[11px] text-teal-bright"
        >
          <span>आणखी एक तथ्य</span>
          <span className="pill-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
