import type { ArticleBlock } from "@/lib/article-types";
import Link from "next/link";

export function ArticleContent({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-content font-deva">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            if (block.level === 2) {
              return (
                <h2 key={i} className="mt-16 mb-6 text-xl font-medium text-pale md:text-2xl">
                  {block.text}
                </h2>
              );
            }
            return (
              <h3 key={i} className="mt-10 mb-4 text-lg font-medium text-pale">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className="mb-6 text-[15px] font-light leading-[2] text-pale-2 md:text-base">
                {block.text}
              </p>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-8 border-l border-teal/40 pl-8 text-lg font-light italic leading-[2] text-pale"
              >
                {block.text}
                {block.attribution && (
                  <footer className="mt-3 font-label text-[9px] not-italic text-dim">
                    — {block.attribution}
                  </footer>
                )}
              </blockquote>
            );
          case "list":
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={i}
                className={`my-6 space-y-2 pl-6 text-pale-2 ${block.ordered ? "list-decimal" : "list-disc"}`}
              >
                {block.items.map((item, j) => (
                  <li key={j} className="leading-[1.9]">
                    {item}
                  </li>
                ))}
              </ListTag>
            );
          case "divider":
            return <hr key={i} className="my-12 border-t hairline" />;
          case "image":
            return (
              <figure key={i} className="my-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.alt ?? ""}
                  className="w-full rounded-lg border hairline"
                />
                {block.caption && (
                  <figcaption className="mt-3 font-label text-[9px] text-dim">{block.caption}</figcaption>
                )}
              </figure>
            );
          case "link":
            return (
              <p key={i} className="mb-6">
                <Link href={block.href} className="text-teal-bright link-quiet underline-offset-4 hover:underline">
                  {block.text}
                </Link>
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export type SourceItem = {
  id: string;
  title: string;
  author: string | null;
  publication: string | null;
  url: string | null;
  year: string | null;
  notes: string | null;
  sourceType: string;
};

export function SourcesSection({ sources }: { sources: SourceItem[] }) {
  if (!sources.length) return null;

  return (
    <section className="mt-20 border-t hairline pt-16">
      <h2 className="font-deva mb-8 text-xl font-medium text-pale">स्रोत</h2>
      <ol className="space-y-6">
        {sources.map((s, i) => (
          <li key={s.id} className="border-b hairline pb-6 last:border-0">
            <p className="font-label text-[9px] text-dim">
              {i + 1}. {s.sourceType}
            </p>
            <p className="font-deva mt-2 text-base text-pale">
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-quiet hover:text-teal-bright">
                  {s.title}
                </a>
              ) : (
                s.title
              )}
            </p>
            {(s.author || s.publication || s.year) && (
              <p className="font-deva mt-1 text-sm text-muted">
                {[s.author, s.publication, s.year].filter(Boolean).join(" • ")}
              </p>
            )}
            {s.notes && <p className="font-deva mt-2 text-sm font-light text-pale-2">{s.notes}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
