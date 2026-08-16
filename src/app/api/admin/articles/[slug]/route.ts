import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJson, toJson } from "@/lib/json";
import type { ArticleBlock } from "@/lib/article-types";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug: rawSlug } = await ctx.params;
  const slug = decodeURIComponent(rawSlug);
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      sources: true,
      entities: { include: { song: true, artist: true } },
    },
  });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...article,
    content: parseJson<ArticleBlock[]>(article.content, []),
    tags: parseJson<string[]>(article.tags, []),
    linkedSongSlugs: article.entities.filter((e) => e.entityType === "SONG").map((e) => e.entitySlug),
    linkedArtistSlugs: article.entities.filter((e) => e.entityType === "ARTIST").map((e) => e.entitySlug),
  });
}

export async function PUT(request: Request, ctx: RouteCtx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug: rawSlug } = await ctx.params;
  const slug = decodeURIComponent(rawSlug);
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const status = body.status ?? existing.status;
  const publishedAt =
    status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt;

  await prisma.article.update({
    where: { slug },
    data: {
      title: body.title ?? existing.title,
      subtitle: body.subtitle ?? existing.subtitle,
      type: body.type ?? existing.type,
      heroImage: body.heroImage ?? existing.heroImage,
      author: body.author ?? existing.author,
      summary: body.summary ?? existing.summary,
      content: body.content ? toJson(body.content) : existing.content,
      tags: body.tags ? toJson(parseTags(body.tags)) : existing.tags,
      status,
      publishedAt,
    },
  });

  if (body.linkedSongSlugs || body.linkedArtistSlugs) {
    await syncEntities(existing.id, body);
  }

  if (Array.isArray(body.sources)) {
    await prisma.source.deleteMany({ where: { articleId: existing.id } });
    for (const src of body.sources) {
      if (!src.title) continue;
      await prisma.source.create({
        data: {
          articleId: existing.id,
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

  return NextResponse.json({ ok: true });
}

async function syncEntities(
  articleId: string,
  body: { linkedSongSlugs?: string[]; linkedArtistSlugs?: string[] },
) {
  await prisma.articleEntity.deleteMany({ where: { articleId } });

  for (const entitySlug of body.linkedSongSlugs ?? []) {
    const song = await prisma.song.findUnique({ where: { slug: entitySlug } });
    if (!song) continue;
    await prisma.articleEntity.create({
      data: { articleId, entityType: "SONG", entitySlug, songId: song.id },
    });
  }

  for (const entitySlug of body.linkedArtistSlugs ?? []) {
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
