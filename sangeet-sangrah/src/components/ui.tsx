import Link from "next/link";
import type { ReactNode } from "react";

export function PillLink({
  href,
  children,
  primary = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`pill inline-flex items-center gap-3 px-8 py-4 font-label text-[11px] ${
        primary ? "text-teal-bright" : "text-pale-2"
      } ${className}`}
    >
      <span>{children}</span>
      <span className="pill-arrow">→</span>
    </Link>
  );
}

export function SectionLabel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div id={id} className="flex items-center gap-4 scroll-mt-24">
      <span className="h-1 w-1 rounded-full bg-teal-bright glow-dot" />
      <span className="font-label text-[10px] text-muted">{children}</span>
      <span className="h-px flex-1 hairline border-t" />
    </div>
  );
}

export function MetaRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b hairline py-3">
      <dt className="font-label shrink-0 text-[9px] text-dim">{label}</dt>
      <dd className="text-right font-deva text-sm text-pale-2">{value}</dd>
    </div>
  );
}

export function ArticleHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-deva mt-16 mb-6 text-xl font-medium text-pale md:text-2xl">
      {children}
    </h2>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="prose-sangrah font-deva text-[15px] font-light md:text-base">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full border hairline px-3 py-1 font-label text-[9px] text-dim"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
