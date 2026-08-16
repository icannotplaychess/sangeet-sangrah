import { notFound } from "next/navigation";
import { SongEditor, type SongFormData } from "@/components/admin/SongEditor";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/json";

export default async function EditSongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const song = await prisma.song.findUnique({
    where: { slug },
    include: { audioAsset: true, youtubeVideo: true },
  });
  if (!song) notFound();

  const initial: SongFormData = {
    id: song.id,
    slug: song.slug,
    title: song.title,
    latinTitle: song.latinTitle ?? "",
    singers: parseJson<string[]>(song.singers, []),
    lyricist: song.lyricist,
    composer: song.composer,
    filmOrAlbum: song.filmOrAlbum ?? "",
    year: song.year ?? "",
    language: song.language,
    type: song.type,
    raga: song.raga ?? "",
    taal: song.taal ?? "",
    theme: song.theme ?? "",
    description: song.description ?? "",
    context: parseJson<string[]>(song.context, []),
    meaning: parseJson<string[]>(song.meaning, []),
    musicAnalysis: parseJson<string[]>(song.musicAnalysis, []),
    culturalContext: parseJson<string[]>(song.culturalContext, []),
    legacy: parseJson<string[]>(song.legacy, []),
    tags: parseJson<string[]>(song.tags, []),
    status: song.status,
    youtubeUrl: song.youtubeVideo?.youtubeUrl ?? "",
    audioAsset: song.audioAsset
      ? {
          audioUrl: song.audioAsset.audioUrl,
          audioFilename: song.audioAsset.audioFilename,
          uploadedAt: song.audioAsset.uploadedAt?.toISOString() ?? null,
          rightsConfirmed: song.audioAsset.rightsConfirmed,
        }
      : null,
    youtubeVideo: song.youtubeVideo ?? null,
  };

  return (
    <div>
      <h1 className="font-deva mb-2 text-3xl text-pale">{song.title}</h1>
      <p className="font-label mb-8 text-[9px] text-dim">/geete/{song.slug}</p>
      <SongEditor initial={initial} useBlobUpload={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
    </div>
  );
}
