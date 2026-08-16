import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const [songs, artists] = await Promise.all([
    prisma.song.findMany({ select: { slug: true, title: true }, orderBy: { title: "asc" } }),
    prisma.artist.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-deva mb-8 text-3xl text-pale">लेख तयार करा</h1>
      <ArticleEditor isNew songOptions={songs} artistOptions={artists} />
    </div>
  );
}
