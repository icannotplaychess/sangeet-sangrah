import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { validateAudioFile } from "@/lib/audio";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const songId = form.get("songId");
  const rightsConfirmed = form.get("rightsConfirmed") === "true";

  if (typeof songId !== "string" || !songId) {
    return NextResponse.json({ error: "गीत निवडलेले नाही." }, { status: 400 });
  }

  if (!rightsConfirmed) {
    return NextResponse.json(
      { error: "कृपया ऑडिओ वापराच्या अधिकाराची पुष्टी करा." },
      { status: 400 },
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ऑडिओ फाइल निवडा." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const validation = validateAudioFile(buffer, file.name, file.type);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const song = await prisma.song.findUnique({ where: { id: songId }, include: { audioAsset: true } });
  if (!song) {
    return NextResponse.json({ error: "गीत सापडले नाही." }, { status: 404 });
  }

  const ext = path.extname(file.name).toLowerCase() || ".mp3";
  const filename = `${song.slug}-${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
  await mkdir(uploadDir, { recursive: true });
  const diskPath = path.join(uploadDir, filename);
  await writeFile(diskPath, buffer);

  const audioUrl = `/uploads/audio/${filename}`;

  if (song.audioAsset) {
    if (song.audioAsset.audioUrl.startsWith("https://")) {
      try {
        await del(song.audioAsset.audioUrl);
      } catch {
        /* blob may already be gone */
      }
    } else {
      const oldPath = path.join(
        process.cwd(),
        "public",
        song.audioAsset.audioUrl.replace(/^\//, ""),
      );
      try {
        await unlink(oldPath);
      } catch {
        /* ignore missing old file */
      }
    }
    await prisma.audioAsset.update({
      where: { songId },
      data: {
        audioUrl,
        audioSource: "UPLOADED",
        audioFilename: file.name,
        mimeType: validation.mimeType,
        fileSize: buffer.length,
        rightsConfirmed: true,
        rightsConfirmedAt: new Date(),
        uploadedAt: new Date(),
        uploadedBy: "admin",
      },
    });
  } else {
    await prisma.audioAsset.create({
      data: {
        songId,
        audioUrl,
        audioSource: "UPLOADED",
        audioFilename: file.name,
        mimeType: validation.mimeType,
        fileSize: buffer.length,
        rightsConfirmed: true,
        rightsConfirmedAt: new Date(),
        uploadedAt: new Date(),
        uploadedBy: "admin",
      },
    });
  }

  return NextResponse.json({ ok: true, audioUrl, filename: file.name });
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { songId } = (await request.json()) as { songId?: string };
  if (!songId) return NextResponse.json({ error: "Missing songId" }, { status: 400 });

  const asset = await prisma.audioAsset.findUnique({ where: { songId } });
  if (asset) {
    if (asset.audioUrl.startsWith("https://")) {
      try {
        await del(asset.audioUrl);
      } catch {
        /* blob may already be gone */
      }
    } else {
      const diskPath = path.join(process.cwd(), "public", asset.audioUrl.replace(/^\//, ""));
      try {
        await unlink(diskPath);
      } catch {
        /* ignore */
      }
    }
    await prisma.audioAsset.delete({ where: { songId } });
  }

  return NextResponse.json({ ok: true });
}
