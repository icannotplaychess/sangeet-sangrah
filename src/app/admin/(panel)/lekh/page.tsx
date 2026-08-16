import Link from "next/link";
import { prisma } from "@/lib/db";
import { ARTICLE_TYPE_LABELS } from "@/lib/article-types";

export const dynamic = "force-dynamic";

export default async function AdminArticlesListPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    select: { slug: true, title: true, type: true, status: true, updatedAt: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-deva text-3xl text-pale">लेख</h1>
        <Link href="/admin/lekh/new" className="admin-btn admin-btn-primary">
          लेख तयार करा
        </Link>
      </div>
      <ul className="mt-10 space-y-2">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/admin/lekh/${a.slug}`} className="group flex justify-between border-b hairline py-4">
              <span className="font-deva text-pale group-hover:text-teal-bright">{a.title}</span>
              <span className="font-label text-[8px] text-dim">
                {ARTICLE_TYPE_LABELS[a.type] ?? a.type} • {a.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
