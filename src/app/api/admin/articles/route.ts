import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify, toJson } from "@/lib/json";
import { emptyArticleContent } from "@/lib/article-types";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "लेखाचे शीर्षक आवश्यक." }, { status: 400 });

  const slug = body.slug?.trim() || slugify(title);
  const exists = await prisma.article.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "हा slug आधीच वापरात आहे." }, { status: 409 });

  const status = body.status || "DRAFT";
  const article = await prisma.article.create({
    data: {
      slug,
      title,
      subtitle: body.subtitle || null,
      type: body.type || "SAMANYA",
      heroImage: body.heroImage || null,
      author: body.author || null,
      summary: body.summary || null,
      content: toJson(body.content ?? emptyArticleContent()),
      tags: toJson(parseTags(body.tags)),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  await syncArticleEntities(article.id, body);

  if (Array.isArray(body.sources)) {
    for (const src of body.sources) {
      if (!src.title) continue;
      await prisma.source.create({
        data: {
          articleId: article.id,
          title: src.title,
          author: src.author || null,
          publication: src.publication || null,
          url: src.url || null,
          year: src.year || null,
          notes: src.notes || null,
          sourceType: src.sourceType || "OTHER",
        },
      });
    }
  }

  return NextResponse.json({ ok: true, slug: article.slug });
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    select: { slug: true, title: true, type: true, status: true, updatedAt: true },
  });
  return NextResponse.json(articles);
}

async function syncArticleEntities(
  articleId: string,
  body: {
    linkedSongSlugs?: string[];
    linkedArtistSlugs?: string[];
  },
) {
  await prisma.articleEntity.deleteMany({ where: { articleId } });

  const songSlugs = body.linkedSongSlugs ?? [];
  const artistSlugs = body.linkedArtistSlugs ?? [];

  for (const entitySlug of songSlugs) {
    const song = await prisma.song.findUnique({ where: { slug: entitySlug } });
    if (!song) continue;
    await prisma.articleEntity.create({
      data: { articleId, entityType: "SONG", entitySlug, songId: song.id },
    });
  }

  for (const entitySlug of artistSlugs) {
    const artist = await prisma.artist.findUnique({ where: { slug: entitySlug } });
    if (!artist) continue;
    await prisma.articleEntity.create({
      data: { articleId, entityType: "ARTIST", entitySlug, artistId: artist.id },
    });
  }
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string")
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}
