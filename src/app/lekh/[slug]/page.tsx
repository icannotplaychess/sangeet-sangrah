import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent, SourcesSection } from "@/components/ArticleContent";
import { SectionLabel, TagList } from "@/components/ui";
import { getPublishedArticle } from "@/lib/repository";
import { ARTICLE_TYPE_LABELS } from "@/lib/article-types";
import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.summary ?? undefined };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <header className="border-b hairline pb-16">
        <Link href="/lekh" className="font-label text-[9px] text-muted link-quiet">
          लेख ←
        </Link>
        <p className="font-label mt-12 text-[10px] text-teal-bright">
          {ARTICLE_TYPE_LABELS[article.type] ?? article.type}
        </p>
        <h1 className="font-deva mt-4 text-4xl font-medium leading-tight text-pale md:text-6xl">
          {article.title}
          <span className="text-teal-bright">.</span>
        </h1>
        {article.subtitle && (
          <p className="font-deva mt-5 text-lg font-light text-muted">{article.subtitle}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-4 font-label text-[9px] text-dim">
          {article.author && <span>{article.author}</span>}
          {article.publishedAt && (
            <span>
              {new Date(article.publishedAt).toLocaleDateString("mr-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </header>

      {article.heroImage && (
        <figure className="my-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.heroImage} alt="" className="w-full rounded-lg border hairline" />
        </figure>
      )}

      {article.summary && (
        <p className="font-deva mt-12 text-lg font-light leading-relaxed text-pale-2">{article.summary}</p>
      )}

      <hr className="my-12 border-t hairline" />

      <ArticleContent blocks={article.content} />

      <hr className="my-16 border-t hairline" />

      {(article.linkedSongs.length > 0 || article.linkedArtists.length > 0) && (
        <section className="space-y-12">
          {article.linkedSongs.length > 0 && (
            <div>
              <SectionLabel>संबंधित गीते</SectionLabel>
              <div className="mt-4">
                {article.linkedSongs.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/geete/${s.slug}`}
                    className="group block border-b hairline py-4 font-deva text-pale group-hover:text-teal-bright"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {article.linkedArtists.length > 0 && (
            <div>
              <SectionLabel>संबंधित कलाकार</SectionLabel>
              <div className="mt-4">
                {article.linkedArtists.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/kalakar/${a.slug}`}
                    className="group block border-b hairline py-4 font-deva text-pale group-hover:text-teal-bright"
                  >
                    {a.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {article.tags.length > 0 && (
        <div className="mt-12">
          <TagList tags={article.tags} />
        </div>
      )}

      <SourcesSection sources={article.sources} />
    </article>
  );
}
