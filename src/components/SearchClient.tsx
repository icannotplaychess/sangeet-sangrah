"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SearchResult = {
  type: string;
  title: string;
  subtitle: string;
  href: string;
};

const suggestions = ["लता", "पाऊस", "गीतरामायण", "अभंग", "यमन", "कट्यार", "श्रावण", "गझल"];

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) setResults(await res.json());
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div>
      <div className="border-b border-line pb-4">
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="कलाकार, गीत, कविता, लेख, राग, तथ्य…"
          className="w-full bg-transparent font-deva text-2xl font-light text-pale outline-none placeholder:text-dim md:text-4xl"
          aria-label="शोध"
        />
      </div>

      {query.trim().length < 2 ? (
        <div className="mt-10">
          <p className="font-label text-[9px] text-dim">सुचवलेले शोध</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="cursor-pointer rounded-full border hairline px-4 py-1.5 font-deva text-sm font-light text-muted transition-colors hover:border-teal-bright/50 hover:text-teal-bright"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : loading ? (
        <p className="font-deva mt-12 text-base font-light text-muted">शोधत आहे…</p>
      ) : results.length === 0 ? (
        <p className="font-deva mt-12 text-base font-light text-muted">
          काहीही सापडले नाही. वेगळा शब्द वापरून पाहा — उदा. कलाकाराचे नाव, गीताची ओळ, राग किंवा विषय.
        </p>
      ) : (
        <div className="mt-8">
          <p className="font-label text-[9px] text-dim">{results.length} निकाल</p>
          <ul className="mt-4">
            {results.map((r, i) => (
              <li key={`${r.href}-${i}`}>
                <Link
                  href={r.href}
                  className="group flex items-baseline justify-between gap-6 border-b hairline py-5 transition-colors hover:border-teal-bright/40"
                >
                  <span>
                    <span className="font-deva block text-lg font-light text-pale transition-colors group-hover:text-teal-bright">
                      {r.title}
                    </span>
                    <span className="font-deva mt-1 block text-xs font-light text-muted">{r.subtitle}</span>
                  </span>
                  <span className="font-label shrink-0 text-[9px] text-dim">{r.type}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
