import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent, SourcesSection } from "@/components/ArticleContent";
import MediaSection from "@/components/MediaSection";
import { ArticleHeading, MetaRow, Prose, SectionLabel, TagList } from "@/components/ui";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getArtistBySlug, getArticlesForSong, getSongBySlug } from "@/lib/repository";
import { ARTICLE_TYPE_LABELS } from "@/lib/article-types";

export async function generateStaticParams() {
  try {
    const songs = await prisma.song.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    return songs.map((song) => ({ slug: song.slug }));
  } catch {
    const { songs } = await import("@/data/songs");
    return songs.map((song) => ({ slug: song.slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const song = await getSongBySlug(slug);
  if (!song) return {};
  return { title: song.title, description: song.context[0] ?? song.theme ?? undefined };
}

export default async function SongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const song = await getSongBySlug(slug);
  if (!song) notFound();

  const [relatedArtists, linkedArticles, isAdmin] = await Promise.all([
    Promise.all(song.relatedArtistSlugs.map((s) => getArtistBySlug(s))),
    getArticlesForSong(song.id),
    isAdminAuthenticated(),
  ]);

  const related = relatedArtists.filter(Boolean);
  const subtitle = [song.filmOrAlbum, song.year].filter(Boolean).join(" · ");

  return (
    <article className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <header className="border-b hairline pb-16">
        <Link href="/geete" className="font-label text-[9px] text-muted link-quiet">
          गीत ←
        </Link>
        <p className="font-label mt-12 text-[10px] text-teal-bright">गीत</p>
        <h1 className="font-deva mt-4 max-w-4xl text-5xl font-medium leading-tight text-pale md:text-7xl">
          {song.title}
          <span className="text-teal-bright">.</span>
        </h1>
        {subtitle && <p className="font-deva mt-5 text-lg font-light text-muted">{subtitle}</p>}
        {song.latinTitle && (
          <p className="font-editorial mt-3 text-xl italic text-dim">{song.latinTitle}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-deva text-sm text-pale-2">
          <span>{song.singers.join(", ")}</span>
          <span>{song.lyricist}</span>
          <span>{song.composer}</span>
        </div>
      </header>

      <MediaSection
        title={song.title}
        audio={song.audio ? { url: song.audio.url, filename: song.audio.filename } : null}
        youtube={song.youtube ? { videoId: song.youtube.videoId } : null}
        isAdmin={isAdmin}
        adminHref={`/admin/geete/${song.slug}`}
      />

      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-24">
        <div>
          {song.excerpt.length > 0 && (
            <div className="mb-16 border-l border-teal/40 pl-8">
              {song.excerpt.map((line) => (
                <p key={line} className="font-deva text-xl font-light leading-[2] text-pale md:text-2xl">
                  {line}
                </p>
              ))}
              <p className="font-label mt-4 text-[8px] text-dim">
                समीक्षेसाठी अल्प उद्धरण — संपूर्ण गीत पुनरुत्पादित केलेले नाही
              </p>
            </div>
          )}

          {song.context.length > 0 && (
            <>
              <ArticleHeading>गीताचा संदर्भ</ArticleHeading>
              <Prose paragraphs={song.context} />
            </>
          )}

          {song.meaning.length > 0 && (
            <>
              <ArticleHeading>भावार्थ</ArticleHeading>
              <Prose paragraphs={song.meaning} />
            </>
          )}

          {song.musicAnalysis.length > 0 && (
            <>
              <ArticleHeading>संगीत</ArticleHeading>
              <Prose paragraphs={song.musicAnalysis} />
            </>
          )}

          {song.lyricist && (
            <>
              <ArticleHeading>गीतकार</ArticleHeading>
              <Prose paragraphs={[`${song.lyricist} — या गीताचे शब्द.`]} />
            </>
          )}

          {song.culturalContext.length > 0 && (
            <>
              <ArticleHeading>सांस्कृतिक संदर्भ</ArticleHeading>
              <Prose paragraphs={song.culturalContext} />
            </>
          )}

          {song.legacy.length > 0 && (
            <>
              <ArticleHeading>आजचा वारसा</ArticleHeading>
              <Prose paragraphs={song.legacy} />
            </>
          )}

          {related.length > 0 && (
            <>
              <ArticleHeading>संबंधित कलाकार</ArticleHeading>
              <div>
                {related.map(
                  (artist) =>
                    artist && (
                      <Link
                        key={artist.slug}
                        href={`/kalakar/${artist.slug}`}
                        className="group flex items-baseline justify-between border-b hairline py-4"
                      >
                        <span className="font-deva text-base font-light text-pale group-hover:text-teal-bright">
                          {artist.name}
                        </span>
                        <span className="font-label text-[9px] text-dim">
                          {artist.categories.join(" • ")} →
                        </span>
                      </Link>
                    ),
                )}
              </div>
            </>
          )}

          {linkedArticles.length > 0 && (
            <>
              <ArticleHeading>संबंधित लेख</ArticleHeading>
              <div>
                {linkedArticles.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/lekh/${a.slug}`}
                    className="group flex items-baseline justify-between border-b hairline py-4"
                  >
                    <span className="font-deva text-base font-light text-pale group-hover:text-teal-bright">
                      {a.title}
                    </span>
                    <span className="font-label text-[9px] text-dim">
                      {ARTICLE_TYPE_LABELS[a.type] ?? a.type} →
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          <SourcesSection sources={song.sources} />
        </div>

        <aside>
          <div className="sticky top-28">
            <SectionLabel>गीत माहिती</SectionLabel>
            <dl className="mt-4">
              <MetaRow label="गायक / गायिका" value={song.singers.join(", ")} />
              <MetaRow label="गीतकार" value={song.lyricist} />
              <MetaRow label="संगीतकार" value={song.composer} />
              {song.filmOrAlbum && <MetaRow label="चित्रपट / संग्रह" value={song.filmOrAlbum} />}
              {song.year && <MetaRow label="वर्ष" value={song.year} />}
              <MetaRow label="भाषा" value={song.language} />
              <MetaRow label="प्रकार / शैली" value={song.type} />
              {song.raga && <MetaRow label="राग" value={song.raga} />}
              {song.taal && <MetaRow label="ताल" value={song.taal} />}
              {song.theme && <MetaRow label="विषय" value={song.theme} />}
            </dl>
            <div className="mt-10">
              <TagList tags={song.tags} />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
