import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHeading, MetaRow, Prose, SectionLabel, TagList } from "@/components/ui";
import { getArtist, getSong, songs } from "@/lib/content";

export function generateStaticParams() {
  return songs.map((song) => ({ slug: song.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const song = getSong(slug);
  if (!song) return {};
  return { title: song.title, description: song.context[0] };
}

export default async function SongPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const song = getSong(slug);
  if (!song) notFound();
  const related = song.relatedArtistSlugs.map(getArtist).filter((a) => Boolean(a));

  return (
    <article className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <header className="border-b hairline pb-16">
        <Link href="/geete" className="font-label text-[9px] text-muted link-quiet">
          गीते ←
        </Link>
        <p className="font-label mt-12 text-[10px] text-teal-bright">{song.type}</p>
        <h1 className="font-deva mt-4 max-w-4xl text-5xl font-medium leading-tight text-pale md:text-7xl">
          {song.title}<span className="text-teal-bright">.</span>
        </h1>
        <p className="font-editorial mt-3 text-xl italic text-dim">{song.latinTitle}</p>
        <p className="font-deva mt-7 text-base font-light text-muted">{song.theme}</p>
      </header>

      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-24">
        <div>
          {song.excerpt && (
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

          <ArticleHeading>गीताचा संदर्भ</ArticleHeading>
          <Prose paragraphs={song.context} />

          <ArticleHeading>भावार्थ</ArticleHeading>
          <Prose paragraphs={song.meaning} />

          <ArticleHeading>संगीतविश्लेषण</ArticleHeading>
          <Prose paragraphs={song.musicAnalysis} />

          <ArticleHeading>सांस्कृतिक संदर्भ</ArticleHeading>
          <Prose paragraphs={song.culturalContext} />

          {related.length > 0 && (
            <>
              <ArticleHeading>संबंधित कलाकार</ArticleHeading>
              <div>
                {related.map((artist) => artist && (
                  <Link
                    key={artist.slug}
                    href={`/kalakar/${artist.slug}`}
                    className="group flex items-baseline justify-between border-b hairline py-4"
                  >
                    <span className="font-deva text-base font-light text-pale group-hover:text-teal-bright">
                      {artist.name}
                    </span>
                    <span className="font-label text-[9px] text-dim">{artist.categories.join(" • ")} →</span>
                  </Link>
                ))}
              </div>
            </>
          )}
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
              <MetaRow label="प्रकार" value={song.type} />
              {song.raga && <MetaRow label="राग" value={song.raga} />}
              {song.taal && <MetaRow label="ताल" value={song.taal} />}
              <MetaRow label="विषय" value={song.theme} />
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
