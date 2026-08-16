import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJson, toJson } from "@/lib/json";
import { extractYouTubeVideoId, buildYouTubeWatchUrl } from "@/lib/youtube";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug: rawSlug } = await ctx.params;
  const slug = decodeURIComponent(rawSlug);
  const song = await prisma.song.findUnique({
    where: { slug },
    include: { audioAsset: true, youtubeVideo: true, sources: true },
  });
  if (!song) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...song,
    singers: parseJson<string[]>(song.singers, []),
    context: parseJson<string[]>(song.context, []),
    meaning: parseJson<string[]>(song.meaning, []),
    musicAnalysis: parseJson<string[]>(song.musicAnalysis, []),
    culturalContext: parseJson<string[]>(song.culturalContext, []),
    legacy: parseJson<string[]>(song.legacy, []),
    tags: parseJson<string[]>(song.tags, []),
    excerpt: parseJson<string[]>(song.excerpt, []),
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
  const existing = await prisma.song.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const singers = Array.isArray(body.singers)
    ? body.singers
    : String(body.singers ?? "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

  const status = body.status ?? existing.status;
  const publishedAt =
    status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt;

  await prisma.song.update({
    where: { slug },
    data: {
      title: body.title ?? existing.title,
      latinTitle: body.latinTitle ?? existing.latinTitle,
      singers: toJson(singers),
      lyricist: body.lyricist ?? existing.lyricist,
      composer: body.composer ?? existing.composer,
      filmOrAlbum: body.filmOrAlbum ?? existing.filmOrAlbum,
      year: body.year ?? existing.year,
      language: body.language ?? existing.language,
      type: body.type ?? existing.type,
      raga: body.raga ?? existing.raga,
      taal: body.taal ?? existing.taal,
      theme: body.theme ?? existing.theme,
      description: body.description ?? existing.description,
      context: toJson(splitLines(body.context)),
      meaning: toJson(splitLines(body.meaning)),
      musicAnalysis: toJson(splitLines(body.musicAnalysis)),
      culturalContext: toJson(splitLines(body.culturalContext)),
      legacy: toJson(splitLines(body.legacy)),
      tags: toJson(parseTags(body.tags)),
      status,
      publishedAt,
    },
  });

  if (body.youtubeUrl !== undefined) {
    const url = String(body.youtubeUrl).trim();
    if (!url) {
      await prisma.youTubeVideo.deleteMany({ where: { songId: existing.id } });
    } else {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        await prisma.youTubeVideo.upsert({
          where: { songId: existing.id },
          create: {
            songId: existing.id,
            youtubeVideoId: videoId,
            youtubeUrl: buildYouTubeWatchUrl(videoId),
          },
          update: { youtubeVideoId: videoId, youtubeUrl: buildYouTubeWatchUrl(videoId) },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

function splitLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split("\n").map((s) => s.trim()).filter(Boolean);
  return [];
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
