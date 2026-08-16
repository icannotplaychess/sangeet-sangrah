"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Result = {
  kind: string;
  title: string;
  subtitle: string;
  href: string;
};

export default function AdminSearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
      if (res.ok) setResults(await res.json());
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div>
      <h1 className="font-deva text-3xl text-pale">शोध</h1>
      <input
        className="admin-input mt-8 max-w-xl"
        placeholder="लता मंगेशकर…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <ul className="mt-8 space-y-3">
        {results.map((r, i) => (
          <li key={i}>
            <Link href={r.href} className="group block border-b hairline py-4">
              <span className="font-label text-[8px] text-dim">{r.kind}</span>
              <p className="font-deva text-base text-pale group-hover:text-teal-bright">{r.title}</p>
              <p className="font-deva text-sm text-muted">{r.subtitle}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
