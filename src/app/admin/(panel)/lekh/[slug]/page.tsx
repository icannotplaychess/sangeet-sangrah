import { notFound } from "next/navigation";
import { ArticleEditor, type ArticleFormData } from "@/components/admin/ArticleEditor";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/json";
import type { ArticleBlock } from "@/lib/article-types";

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const [article, songs, artists] = await Promise.all([
    prisma.article.findUnique({
      where: { slug },
      include: { sources: true, entities: true },
    }),
    prisma.song.findMany({ select: { slug: true, title: true }, orderBy: { title: "asc" } }),
    prisma.artist.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!article) notFound();

  const initial: ArticleFormData = {
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle ?? "",
    type: article.type,
    heroImage: article.heroImage ?? "",
    author: article.author ?? "",
    summary: article.summary ?? "",
    content: parseJson<ArticleBlock[]>(article.content, []),
    tags: parseJson<string[]>(article.tags, []),
    status: article.status,
    linkedSongSlugs: article.entities.filter((e) => e.entityType === "SONG").map((e) => e.entitySlug),
    linkedArtistSlugs: article.entities.filter((e) => e.entityType === "ARTIST").map((e) => e.entitySlug),
    sources: article.sources.map((s) => ({
      title: s.title,
      author: s.author ?? "",
      publication: s.publication ?? "",
      url: s.url ?? "",
      year: s.year ?? "",
      notes: s.notes ?? "",
      sourceType: s.sourceType,
    })),
  };

  return (
    <div>
      <h1 className="font-deva mb-8 text-3xl text-pale">{article.title}</h1>
      <ArticleEditor initial={initial} songOptions={songs} artistOptions={artists} />
    </div>
  );
}
