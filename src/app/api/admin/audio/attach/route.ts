import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAllowedAudioExtension } from "@/lib/audio";

/** Record an already-uploaded Blob audio file against a song. */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    songId?: string;
    url?: string;
    filename?: string;
    size?: number;
    contentType?: string;
    rightsConfirmed?: boolean;
  };

  if (!body.songId || !body.url) {
    return NextResponse.json({ error: "अपूर्ण माहिती." }, { status: 400 });
  }
  if (!body.rightsConfirmed) {
    return NextResponse.json(
      { error: "कृपया ऑडिओ वापराच्या अधिकाराची पुष्टी करा." },
      { status: 400 },
    );
  }
  if (!body.url.startsWith("https://") || !isAllowedAudioExtension(new URL(body.url).pathname)) {
    return NextResponse.json({ error: "वैध ऑडिओ URL नाही." }, { status: 400 });
  }

  const song = await prisma.song.findUnique({
    where: { id: body.songId },
    include: { audioAsset: true },
  });
  if (!song) return NextResponse.json({ error: "गीत सापडले नाही." }, { status: 404 });

  // Remove the previous blob so storage doesn't accumulate orphans.
  if (song.audioAsset?.audioUrl.startsWith("https://")) {
    try {
      await del(song.audioAsset.audioUrl);
    } catch {
      /* old blob may already be gone */
    }
  }

  const data = {
    audioUrl: body.url,
    audioSource: "UPLOADED",
    audioFilename: body.filename ?? null,
    mimeType: body.contentType ?? null,
    fileSize: body.size ?? null,
    rightsConfirmed: true,
    rightsConfirmedAt: new Date(),
    uploadedAt: new Date(),
    uploadedBy: "admin",
  };

  if (song.audioAsset) {
    await prisma.audioAsset.update({ where: { songId: song.id }, data });
  } else {
    await prisma.audioAsset.create({ data: { songId: song.id, ...data } });
  }

  return NextResponse.json({ ok: true, audioUrl: body.url });
}
