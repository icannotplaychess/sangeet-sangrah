import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHeading, Prose, SectionLabel, TagList } from "@/components/ui";
import { getArtist, getPoem, poems } from "@/lib/content";

export function generateStaticParams() {
  return poems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const poem = getPoem(slug);
  if (!poem) return {};
  return { title: poem.title, description: poem.about[0] };
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poem = getPoem(slug);
  if (!poem) notFound();
  const poet = poem.poetSlug ? getArtist(poem.poetSlug) : undefined;

  return (
    <article className="min-h-screen">
      {/* Poetry reader — typography-focused, huge margins */}
      <div className="mx-auto max-w-3xl px-8 py-24 md:px-16 md:py-32">
        <Link href="/kavita" className="font-label text-[9px] text-muted link-quiet">
          कविता ←
        </Link>

        <header className="mt-16 border-b hairline pb-12">
          <p className="font-label text-[10px] text-teal-bright">{poem.category}</p>
          <h1 className="font-deva mt-4 text-4xl font-medium leading-tight text-pale md:text-5xl">
            {poem.title}
          </h1>
          <p className="font-deva mt-6 text-base font-light text-muted">
            {poem.poetName}
            {poet && (
              <>
                {" "}
                •{" "}
                <Link
                  href={`/kalakar/${poet.slug}`}
                  className="text-teal-bright link-quiet"
                >
                  अधिक वाचा
                </Link>
              </>
            )}
          </p>
          <p className="font-label mt-2 text-[9px] text-dim">{poem.era}</p>
        </header>

        {/* Full text for public domain; excerpt otherwise */}
        {poem.text ? (
          <div className="mt-20 space-y-12">
            {poem.text.map((stanza, si) => (
              <div key={si} className="space-y-4">
                {stanza.map((line, li) => (
                  <p
                    key={li}
                    className="font-deva text-xl font-light leading-[2.2] text-pale md:text-2xl md:leading-[2.4]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ) : poem.excerpt ? (
          <div className="mt-20">
            <blockquote className="border-l border-teal/40 pl-8">
              {poem.excerpt.map((line) => (
                <p
                  key={line}
                  className="font-deva text-xl font-light leading-[2.2] text-pale md:text-2xl"
                >
                  {line}
                </p>
              ))}
            </blockquote>
            <p className="font-label mt-6 text-[8px] text-dim">
              प्रताधिकारित काव्य — केवळ अल्प उद्धरण. संपूर्ण कविता अधिकृत संग्रहांत उपलब्ध.
            </p>
          </div>
        ) : null}

        <footer className="mt-24 border-t hairline pt-12">
          <ArticleHeading>कवितेविषयी</ArticleHeading>
          <Prose paragraphs={poem.about} />

          <ArticleHeading>रसग्रहण</ArticleHeading>
          <Prose paragraphs={poem.analysis} />

          <div className="mt-12">
            <TagList tags={poem.tags} />
          </div>
        </footer>
      </div>
    </article>
  );
}
