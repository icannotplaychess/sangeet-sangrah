import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui";
import { getPublishedArticles } from "@/lib/repository";
import { ARTICLE_TYPE_LABELS } from "@/lib/article-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "लेख",
  description: "संगीत संग्रह — संपादकीय लेख, विश्लेषण आणि सांस्कृतिक लेखन.",
};

export default async function ArticlesIndexPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="mx-auto max-w-4xl px-5 py-20 md:px-8 md:py-28">
      <SectionLabel>लेख</SectionLabel>
      <h1 className="font-deva mt-8 text-5xl font-medium text-pale md:text-6xl">
        संपादकीय लेख<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-6 max-w-2xl text-base font-light leading-relaxed text-muted">
        गीत, कलाकार, परंपरा आणि संगीत विश्लेषण — ज्ञान संग्रहाच्या स्वरूपात.
      </p>

      <div className="mt-16 space-y-0">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/lekh/${a.slug}`}
            className="group block border-b hairline py-10 first:border-t"
          >
            <p className="font-label text-[9px] text-teal-bright">
              {ARTICLE_TYPE_LABELS[a.type] ?? a.type}
            </p>
            <h2 className="font-deva mt-3 text-2xl font-medium text-pale group-hover:text-teal-bright md:text-3xl">
              {a.title}
            </h2>
            {a.subtitle && <p className="font-deva mt-2 text-base text-muted">{a.subtitle}</p>}
            {a.summary && (
              <p className="font-deva mt-4 max-w-2xl text-sm font-light leading-relaxed text-pale-2">
                {a.summary}
              </p>
            )}
            {a.author && <p className="font-label mt-4 text-[8px] text-dim">{a.author}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
