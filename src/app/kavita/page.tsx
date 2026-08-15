import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui";
import { poems } from "@/lib/content";

export const metadata: Metadata = {
  title: "कविता",
  description: "मराठी कविता — निसर्ग, भक्ती, जीवनविचार आणि संतकाव्य.",
};

const categories = Array.from(new Set(poems.map((p) => p.category)));

export default function KavitaPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">काव्य • शब्द • स्मृती</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        कविता<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-7 max-w-2xl text-base font-light leading-loose text-pale-2">
        बालकवींच्या श्रावणापासून ज्ञानेश्वरांच्या पसायदानापर्यंत — मराठी काव्याची
        निवडक वाचनालय.
      </p>

      <div className="mt-14 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full border hairline px-4 py-2 font-label text-[9px] text-muted"
          >
            {cat}
          </span>
        ))}
      </div>

      <section className="mt-24">
        <SectionLabel>{poems.length} कविता</SectionLabel>
        <div className="mt-8">
          {poems.map((poem, i) => (
            <Link
              key={poem.slug}
              href={`/kavita/${poem.slug}`}
              className="group grid gap-4 border-b hairline py-8 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline"
            >
              <span className="font-label text-[9px] text-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="font-deva block text-2xl font-medium text-pale transition-colors group-hover:text-teal-bright md:text-3xl">
                  {poem.title}
                </span>
                <span className="font-deva mt-2 block text-sm font-light text-muted">
                  {poem.poetName} • {poem.era}
                </span>
              </span>
              <span className="font-label text-[9px] text-dim">
                {poem.category} <span className="pill-arrow ml-3 text-teal-bright">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
