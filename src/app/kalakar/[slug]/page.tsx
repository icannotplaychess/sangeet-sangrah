import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHeading, Prose, SectionLabel, TagList } from "@/components/ui";
import {
  allArtists,
  getArtist,
  getSong,
  poemsOfPoet,
  songsOfArtist,
} from "@/lib/content";

export function generateStaticParams() {
  return allArtists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return {};
  return {
    title: artist.name,
    description: artist.intro[0],
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();
  const artistSongs = songsOfArtist(artist);
  const artistPoems = poemsOfPoet(artist.slug);
  const collaborators = artist.collaborations
    .map(getArtist)
    .filter((a) => Boolean(a));
  const related = artist.related.map(getArtist).filter((a) => Boolean(a));

  return (
    <article className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <header className="border-b hairline pb-16">
        <Link href="/kalakar" className="font-label text-[9px] text-muted link-quiet">
          कलाकार ←
        </Link>
        <h1 className="font-deva mt-8 max-w-4xl text-5xl font-medium leading-tight text-pale md:text-7xl">
          {artist.name}
          <span className="text-teal-bright">.</span>
        </h1>
        <p className="font-editorial mt-3 text-xl italic text-dim">{artist.latinName}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="font-label text-[10px] text-teal-bright">{artist.meta}</p>
          <p className="font-label text-[10px] text-dim">{artist.period}</p>
        </div>
      </header>

      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-24">
        <div>
          <ArticleHeading>परिचय</ArticleHeading>
          <Prose paragraphs={artist.intro} />

          <ArticleHeading>जीवनप्रवास</ArticleHeading>
          <ol className="border-l hairline">
            {artist.timeline.map((entry) => (
              <li key={`${entry.year}-${entry.event}`} className="relative pb-8 pl-8 last:pb-0">
                <span className="absolute -left-[3px] top-2 h-1.5 w-1.5 rounded-full bg-teal-bright glow-dot" />
                <p className="font-label text-[9px] text-teal-bright">{entry.year}</p>
                <p className="font-deva mt-2 text-[15px] font-light leading-loose text-pale-2">
                  {entry.event}
                </p>
              </li>
            ))}
          </ol>

          <ArticleHeading>संगीतविश्वातील योगदान</ArticleHeading>
          <Prose paragraphs={artist.contribution} />

          {(artistSongs.length > 0 || artist.notableWorks?.length) && (
            <>
              <ArticleHeading>उल्लेखनीय {artistSongs.length ? "गीते" : "रचना"}</ArticleHeading>
              <div>
                {artistSongs.map((song) => (
                  <Link
                    key={song.slug}
                    href={`/geete/${song.slug}`}
                    className="group flex items-baseline justify-between gap-4 border-b hairline py-4"
                  >
                    <span className="font-deva text-base font-light text-pale transition-colors group-hover:text-teal-bright">
                      {song.title}
                    </span>
                    <span className="font-label text-[9px] text-dim">
                      {song.type} <span className="pill-arrow ml-2 text-teal-bright">→</span>
                    </span>
                  </Link>
                ))}
                {artist.notableWorks?.map((work) => (
                  <p
                    key={work}
                    className="border-b hairline py-4 font-deva text-[15px] font-light leading-loose text-pale-2"
                  >
                    {work}
                  </p>
                ))}
              </div>
            </>
          )}

          {artistPoems.length > 0 && (
            <>
              <ArticleHeading>निवडक कविता</ArticleHeading>
              {artistPoems.map((poem) => (
                <Link
                  key={poem.slug}
                  href={`/kavita/${poem.slug}`}
                  className="group flex justify-between border-b hairline py-4"
                >
                  <span className="font-deva text-base text-pale group-hover:text-teal-bright">
                    {poem.title}
                  </span>
                  <span className="font-label text-[9px] text-dim">{poem.category} →</span>
                </Link>
              ))}
            </>
          )}

          <ArticleHeading>शैली</ArticleHeading>
          <Prose paragraphs={artist.style} />

          <ArticleHeading>निवडक तथ्ये</ArticleHeading>
          <ul className="space-y-5">
            {artist.facts.map((fact, i) => (
              <li key={fact} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-label pt-1 text-[9px] text-teal-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-deva text-[15px] font-light leading-loose text-pale-2">{fact}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside>
          <div className="sticky top-28 space-y-12">
            {collaborators.length > 0 && (
              <div>
                <SectionLabel>सहकार्य</SectionLabel>
                <div className="mt-4">
                  {collaborators.map((person) => person && (
                    <Link
                      key={person.slug}
                      href={`/kalakar/${person.slug}`}
                      className="font-deva block border-b hairline py-3 text-sm font-light text-pale-2 link-quiet"
                    >
                      {person.name} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {related.length > 0 && (
              <div>
                <SectionLabel>संबंधित व्यक्ती</SectionLabel>
                <div className="mt-4">
                  {related.map((person) => person && (
                    <Link
                      key={person.slug}
                      href={`/kalakar/${person.slug}`}
                      className="font-deva block border-b hairline py-3 text-sm font-light text-pale-2 link-quiet"
                    >
                      {person.name} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <TagList tags={artist.tags} />
          </div>
        </aside>
      </div>
    </article>
  );
}
