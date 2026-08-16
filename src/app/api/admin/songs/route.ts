import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify, toJson } from "@/lib/json";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "गीताचे नाव आवश्यक." }, { status: 400 });

  const slug = body.slug?.trim() || slugify(title);
  const exists = await prisma.song.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "हा slug आधीच वापरात आहे." }, { status: 409 });

  const singers = Array.isArray(body.singers)
    ? body.singers
    : String(body.singers ?? "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

  const song = await prisma.song.create({
    data: {
      slug,
      title,
      latinTitle: body.latinTitle || null,
      singers: toJson(singers),
      lyricist: body.lyricist || "",
      composer: body.composer || "",
      filmOrAlbum: body.filmOrAlbum || null,
      year: body.year || null,
      language: body.language || "मराठी",
      type: body.type || "भावगीत",
      raga: body.raga || null,
      taal: body.taal || null,
      theme: body.theme || null,
      description: body.description || null,
      context: toJson(splitLines(body.context)),
      meaning: toJson(splitLines(body.meaning)),
      musicAnalysis: toJson(splitLines(body.musicAnalysis)),
      culturalContext: toJson(splitLines(body.culturalContext)),
      legacy: toJson(splitLines(body.legacy)),
      tags: toJson(parseTags(body.tags)),
      status: body.status || "DRAFT",
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    },
  });

  if (body.youtubeUrl) {
    const { extractYouTubeVideoId, buildYouTubeWatchUrl } = await import("@/lib/youtube");
    const videoId = extractYouTubeVideoId(String(body.youtubeUrl));
    if (videoId) {
      await prisma.youTubeVideo.create({
        data: { songId: song.id, youtubeVideoId: videoId, youtubeUrl: buildYouTubeWatchUrl(videoId) },
      });
    }
  }

  return NextResponse.json({ ok: true, slug: song.slug, id: song.id });
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

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const songs = await prisma.song.findMany({
    orderBy: { title: "asc" },
    select: { id: true, slug: true, title: true, status: true, lyricist: true, composer: true },
  });
  return NextResponse.json(songs);
}
