import { NextResponse } from "next/server";
import { searchContent } from "@/lib/content";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/json";
import { blocksToPlainText } from "@/lib/article-types";
import type { ArticleBlock } from "@/lib/article-types";

function norm(s: string): string {
  return s.toLowerCase().normalize("NFC");
}

async function queryDb(query: string) {
  const [songs, artists, articles] = await Promise.all([
    prisma.song.findMany({
      where: { status: "PUBLISHED", title: { contains: query } },
      take: 10,
      select: { slug: true, title: true, lyricist: true, composer: true, singers: true },
    }),
    prisma.artist.findMany({
      where: { status: "PUBLISHED", name: { contains: query } },
      take: 10,
      select: { slug: true, name: true, meta: true },
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ title: { contains: query } }, { summary: { contains: query } }],
      },
      take: 10,
      select: { slug: true, title: true, summary: true, type: true, content: true },
    }),
  ]);
  return { songs, artists, articles };
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const query = q.trim();
  if (query.length < 2) return NextResponse.json([]);

  const staticResults = searchContent(query, 30);

  let dbData: Awaited<ReturnType<typeof queryDb>> = { songs: [], artists: [], articles: [] };
  try {
    dbData = await queryDb(query);
  } catch {
    /* no database configured — static results only */
  }
  const { songs, artists, articles } = dbData;

  const nq = norm(query);
  const dbResults = [
    ...songs.map((s) => ({
      type: "गीत" as const,
      title: s.title,
      subtitle: `${s.lyricist} • ${s.composer}`,
      href: `/geete/${s.slug}`,
      haystack: norm([s.title, s.lyricist, s.composer, s.singers].join(" ")),
    })),
    ...artists.map((a) => ({
      type: "कलाकार" as const,
      title: a.name,
      subtitle: a.meta ?? "",
      href: `/kalakar/${a.slug}`,
      haystack: norm(a.name),
    })),
    ...articles.map((a) => ({
      type: "लेख" as const,
      title: a.title,
      subtitle: a.summary ?? a.type,
      href: `/lekh/${a.slug}`,
      haystack: norm(
        [a.title, a.summary ?? "", blocksToPlainText(parseJson<ArticleBlock[]>(a.content, []))].join(
          " ",
        ),
      ),
    })),
  ].filter((d) => d.haystack.includes(nq));

  const seen = new Set<string>();
  const merged = [...dbResults, ...staticResults].filter((r) => {
    if (seen.has(r.href)) return false;
    seen.add(r.href);
    return true;
  });

  return NextResponse.json(merged.slice(0, 40));
}
