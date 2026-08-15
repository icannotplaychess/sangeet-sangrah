"use client";

import { useMemo, useState } from "react";
import { quizQuestions } from "@/data/quiz";
import type { QuizCategory, QuizQuestion } from "@/data/types";

const categories: (QuizCategory | "सर्व विषय")[] = [
  "सर्व विषय",
  "कलाकार ओळखा",
  "गीत ओळखा",
  "संगीतकार कोण?",
  "गीतकार कोण?",
  "दशक ओळखा",
  "इतिहास",
  "कविता",
  "राग आणि संगीत",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND_SIZE = 8;

export default function QuizEngine() {
  const [category, setCategory] = useState<(typeof categories)[number] | null>(null);
  const [round, setRound] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = useMemo(() => round.length, [round]);

  function start(cat: (typeof categories)[number]) {
    const pool =
      cat === "सर्व विषय" ? quizQuestions : quizQuestions.filter((q) => q.category === cat);
    setCategory(cat);
    setRound(shuffle(pool).slice(0, ROUND_SIZE));
    setCurrent(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }

  if (!category) {
    return (
      <div>
        <p className="font-deva text-base font-light leading-loose text-pale-2">
          विषय निवडा — प्रत्येक फेरीत जास्तीत जास्त {ROUND_SIZE} प्रश्न. उत्तरानंतर स्पष्टीकरण मिळेल.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => start(c)}
              className="pill cursor-pointer px-6 py-5 text-left font-label text-[10px] text-pale-2"
            >
              {c} <span className="pill-arrow ml-2 inline-block text-teal-bright">→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="animate-fade-up">
        <p className="font-label text-[10px] text-teal-bright">फेरी संपली</p>
        <p className="font-deva mt-6 text-4xl font-medium text-pale md:text-6xl">
          {score} / {total}
        </p>
        <p className="font-deva mt-6 text-base font-light leading-loose text-pale-2">
          {score === total
            ? "अभिनंदन! तुम्ही मराठी संगीताचे खरे अभ्यासक आहात."
            : score >= total / 2
              ? "उत्तम! संग्रहात आणखी भटकंती करा — पुढची फेरी अधिक सोपी वाटेल."
              : "हरकत नाही — संग्रहातील लेख वाचा आणि पुन्हा प्रयत्न करा. स्मृती अशीच घडते."}
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => start(category)}
            className="pill cursor-pointer px-8 py-4 font-label text-[11px] text-teal-bright"
          >
            पुन्हा खेळा <span className="pill-arrow ml-2 inline-block">→</span>
          </button>
          <button
            type="button"
            onClick={() => setCategory(null)}
            className="pill cursor-pointer px-8 py-4 font-label text-[11px] text-pale-2"
          >
            दुसरा विषय
          </button>
        </div>
      </div>
    );
  }

  const q = round[current];
  const answered = picked !== null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="font-label text-[9px] text-dim">
          {category} • प्रश्न {current + 1} / {total}
        </p>
        <p className="font-label text-[9px] text-muted">गुण: {score}</p>
      </div>

      <div key={q.id} className="mt-10 animate-fade-up">
        <h2 className="font-deva text-xl font-medium leading-relaxed text-pale md:text-2xl">
          {q.question}
        </h2>

        <div className="mt-8 flex flex-col gap-3">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answerIndex;
            const isPicked = i === picked;
            let cls = "hairline text-pale-2 hover:border-teal-bright/50";
            if (answered && isCorrect) cls = "border-teal-bright/80 text-teal-bright";
            else if (answered && isPicked) cls = "border-red-400/50 text-red-300/80";
            else if (answered) cls = "hairline text-dim";
            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => {
                  setPicked(i);
                  if (isCorrect) setScore((s) => s + 1);
                }}
                className={`cursor-pointer rounded-2xl border px-6 py-4 text-left font-deva text-[15px] font-light transition-colors disabled:cursor-default ${cls}`}
              >
                <span className="font-label mr-4 text-[9px] text-dim">
                  {["अ", "ब", "क", "ड"][i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-8 animate-fade-up border-l border-teal/40 pl-6">
            <p className="font-label text-[9px] text-teal-bright">
              {picked === q.answerIndex ? "बरोबर!" : "चूक — योग्य उत्तर: " + q.options[q.answerIndex]}
            </p>
            <p className="font-deva mt-3 text-[15px] font-light leading-loose text-pale-2">
              {q.explanation}
            </p>
          </div>
        )}
      </div>

      {answered && (
        <div className="mt-12">
          <button
            type="button"
            onClick={() => {
              if (current + 1 >= total) {
                setFinished(true);
              } else {
                setCurrent((c) => c + 1);
                setPicked(null);
              }
            }}
            className="pill cursor-pointer px-8 py-4 font-label text-[11px] text-teal-bright"
          >
            {current + 1 >= total ? "निकाल पाहा" : "पुढचा प्रश्न"}{" "}
            <span className="pill-arrow ml-2 inline-block">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
