import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { extractYouTubeVideoId, buildYouTubeWatchUrl } from "@/lib/youtube";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { songId, youtubeUrl } = (await request.json()) as {
    songId?: string;
    youtubeUrl?: string;
  };

  if (!songId || !youtubeUrl) {
    return NextResponse.json({ error: "YouTube URL आवश्यक आहे." }, { status: 400 });
  }

  const videoId = extractYouTubeVideoId(youtubeUrl);
  if (!videoId) {
    return NextResponse.json({ error: "वैध YouTube URL नाही." }, { status: 400 });
  }

  const watchUrl = buildYouTubeWatchUrl(videoId);

  await prisma.youTubeVideo.upsert({
    where: { songId },
    create: { songId, youtubeVideoId: videoId, youtubeUrl: watchUrl },
    update: { youtubeVideoId: videoId, youtubeUrl: watchUrl },
  });

  return NextResponse.json({ ok: true, videoId });
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { songId } = (await request.json()) as { songId?: string };
  if (!songId) return NextResponse.json({ error: "Missing songId" }, { status: 400 });

  await prisma.youTubeVideo.deleteMany({ where: { songId } });
  return NextResponse.json({ ok: true });
}
