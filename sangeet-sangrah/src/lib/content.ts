import { gayak } from "@/data/artists-gayak";
import { sangeetkar } from "@/data/artists-sangeetkar";
import { geetkar } from "@/data/artists-geetkar";
import { kavi } from "@/data/artists-kavi";
import { songs } from "@/data/songs";
import { poems } from "@/data/poems";
import { shayari } from "@/data/shayari";
import { facts } from "@/data/facts";
import { quizQuestions } from "@/data/quiz";
import { eras } from "@/data/history";
import { films } from "@/data/films";
import { ragas } from "@/data/ragas";
import { instruments } from "@/data/instruments";
import type { Artist, ArtistCategory, Song } from "@/data/types";

export const allArtists: Artist[] = [...gayak, ...sangeetkar, ...geetkar, ...kavi];

export { songs, poems, shayari, facts, quizQuestions, eras, films, ragas, instruments };

const artistBySlug = new Map(allArtists.map((a) => [a.slug, a]));
const songBySlug = new Map(songs.map((s) => [s.slug, s]));
const poemBySlug = new Map(poems.map((p) => [p.slug, p]));

export function getArtist(slug: string): Artist | undefined {
  return artistBySlug.get(slug);
}

export function getSong(slug: string): Song | undefined {
  return songBySlug.get(slug);
}

export function getPoem(slug: string) {
  return poemBySlug.get(slug);
}

export function getEra(slug: string) {
  return eras.find((e) => e.slug === slug);
}

export function artistsByCategory(category: ArtistCategory): Artist[] {
  return allArtists.filter((a) => a.categories.includes(category));
}

export function songsOfArtist(artist: Artist): Song[] {
  const fromLinks = artist.notableSongSlugs
    .map((slug) => songBySlug.get(slug))
    .filter((s): s is Song => Boolean(s));
  const mentioned = songs.filter(
    (s) => s.relatedArtistSlugs.includes(artist.slug) && !fromLinks.includes(s),
  );
  return [...fromLinks, ...mentioned];
}

export function poemsOfPoet(slug: string) {
  return poems.filter((p) => p.poetSlug === slug);
}

/* ——— शोध (search) ——— */

export type SearchResultType =
  | "कलाकार"
  | "गीत"
  | "कविता"
  | "शायरी"
  | "तथ्य"
  | "चित्रपट"
  | "राग"
  | "वाद्य"
  | "कालखंड";

export interface SearchDoc {
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
  haystack: string; // all searchable text, lowercased
}

function norm(s: string): string {
  return s.toLowerCase().normalize("NFC");
}

let searchIndex: SearchDoc[] | null = null;

export function getSearchIndex(): SearchDoc[] {
  if (searchIndex) return searchIndex;
  const docs: SearchDoc[] = [];

  for (const a of allArtists) {
    docs.push({
      type: "कलाकार",
      title: a.name,
      subtitle: a.meta,
      href: `/kalakar/${a.slug}`,
      haystack: norm(
        [a.name, a.latinName, a.meta, a.period, ...a.tags, ...a.intro, ...a.categories].join(" • "),
      ),
    });
  }
  for (const s of songs) {
    docs.push({
      type: "गीत",
      title: s.title,
      subtitle: `${s.lyricist} • ${s.composer} • ${s.singers.join(", ")}`,
      href: `/geete/${s.slug}`,
      haystack: norm(
        [
          s.title,
          s.latinTitle,
          s.lyricist,
          s.composer,
          s.singers.join(" "),
          s.filmOrAlbum ?? "",
          s.type,
          s.theme,
          s.raga ?? "",
          ...s.tags,
          ...s.context,
          ...s.meaning,
        ].join(" • "),
      ),
    });
  }
  for (const p of poems) {
    docs.push({
      type: "कविता",
      title: p.title,
      subtitle: `${p.poetName} • ${p.category}`,
      href: `/kavita/${p.slug}`,
      haystack: norm(
        [
          p.title,
          p.poetName,
          p.category,
          p.era,
          ...p.tags,
          ...(p.text?.flat() ?? []),
          ...(p.excerpt ?? []),
          ...p.about,
        ].join(" • "),
      ),
    });
  }
  for (const sh of shayari) {
    docs.push({
      type: "शायरी",
      title: sh.lines[0],
      subtitle: `शायरी • ${sh.theme}`,
      href: `/shayari#${sh.theme}`,
      haystack: norm([sh.theme, ...sh.lines].join(" • ")),
    });
  }
  for (const f of facts) {
    docs.push({
      type: "तथ्य",
      title: f.text.length > 90 ? f.text.slice(0, 90) + "…" : f.text,
      subtitle: `तथ्य • ${f.category}`,
      href: `/tathya?id=${f.id}`,
      haystack: norm(`${f.category} • ${f.text}`),
    });
  }
  for (const fl of films) {
    docs.push({
      type: "चित्रपट",
      title: fl.title,
      subtitle: `चित्रपट • ${fl.year}${fl.composer ? ` • संगीत: ${fl.composer}` : ""}`,
      href: `/itihas#chitrapat`,
      haystack: norm([fl.title, fl.year, fl.director ?? "", fl.composer ?? "", ...fl.note].join(" • ")),
    });
  }
  for (const r of ragas) {
    docs.push({
      type: "राग",
      title: `राग ${r.name}`,
      subtitle: `${r.mood}`,
      href: `/itihas#raag`,
      haystack: norm([r.name, r.thaat ?? "", r.mood, r.time ?? "", ...r.description].join(" • ")),
    });
  }
  for (const i of instruments) {
    docs.push({
      type: "वाद्य",
      title: i.name,
      subtitle: `${i.kind} • ${i.context}`,
      href: `/itihas#vadya`,
      haystack: norm([i.name, i.kind, i.description, i.context].join(" • ")),
    });
  }
  for (const e of eras) {
    docs.push({
      type: "कालखंड",
      title: e.name,
      subtitle: e.period,
      href: `/itihas#${e.slug}`,
      haystack: norm(
        [e.name, e.period, e.summary, ...e.description, ...e.keyArtists, ...e.keySongs].join(" • "),
      ),
    });
  }

  searchIndex = docs;
  return docs;
}

export function searchContent(query: string, limit = 40): SearchDoc[] {
  const q = norm(query.trim());
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const docs = getSearchIndex();
  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of docs) {
    let score = 0;
    for (const t of terms) {
      if (!doc.haystack.includes(t)) {
        score = 0;
        break;
      }
      score += norm(doc.title).includes(t) ? 3 : 1;
    }
    if (score > 0) scored.push({ doc, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.doc);
}

/* ——— काहीही उघडा (random discovery) ——— */

export interface DiscoveryTarget {
  label: string;
  title: string;
  href: string;
}

export function getDiscoveryTargets(): DiscoveryTarget[] {
  return [
    ...allArtists.map((a) => ({
      label: a.categories[0] === "गायक" ? "कलाकार" : a.categories[0],
      title: a.name,
      href: `/kalakar/${a.slug}`,
    })),
    ...songs.map((s) => ({ label: "गीत", title: s.title, href: `/geete/${s.slug}` })),
    ...poems.map((p) => ({ label: "कविता", title: p.title, href: `/kavita/${p.slug}` })),
    ...eras.map((e) => ({ label: "इतिहास", title: e.name, href: `/itihas#${e.slug}` })),
    { label: "तथ्य", title: "आजचा तथ्य", href: "/tathya" },
    { label: "शायरी", title: "शायरी संग्रह", href: "/shayari" },
  ];
}
