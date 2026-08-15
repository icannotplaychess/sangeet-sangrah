import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui";
import { allArtists, artistsByCategory } from "@/lib/content";
import type { ArtistCategory } from "@/data/types";

export const metadata: Metadata = {
  title: "कलाकार",
  description: "मराठी संगीताच्या सुवर्णकाळातील गायक, संगीतकार, गीतकार आणि कवी.",
};

const groups: { category: ArtistCategory; label: string; note: string }[] = [
  { category: "गायक", label: "गायक / गायिका", note: "मराठी स्वरविश्व घडवणारे आवाज" },
  { category: "संगीतकार", label: "संगीतकार", note: "शब्दांना स्वर देणारे शिल्पकार" },
  { category: "गीतकार", label: "गीतकार", note: "मराठी गीताची शब्दपरंपरा" },
  { category: "कवी", label: "कवी", note: "कविता, संतवाणी आणि साहित्य" },
  { category: "शाहीर", label: "शाहीर", note: "लोकसंगीताचा बुलंद आवाज" },
];

export default function ArtistsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">कलाकारांचा कोश</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        कलाकार<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-7 max-w-2xl text-base font-light leading-loose text-pale-2">
        लता मंगेशकरांपासून सुधीर फडक्यांपर्यंत, गदिमांपासून संत तुकारामांपर्यंत —
        मराठी संगीताच्या अभिजात परंपरेतील {allArtists.length} व्यक्तिमत्त्वे.
      </p>

      <div className="mt-24 space-y-24">
        {groups.map((group) => {
          const artists = artistsByCategory(group.category);
          if (!artists.length) return null;
          return (
            <section key={group.category}>
              <SectionLabel>{group.label}</SectionLabel>
              <p className="font-deva mt-4 text-sm font-light text-muted">{group.note}</p>
              <div className="mt-8">
                {artists.map((artist, i) => (
                  <Link
                    key={artist.slug}
                    href={`/kalakar/${artist.slug}`}
                    className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 border-b hairline py-5"
                  >
                    <span className="font-label text-[9px] text-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="font-deva block text-xl font-medium text-pale transition-colors group-hover:text-teal-bright md:text-2xl">
                        {artist.name}
                      </span>
                      <span className="font-label mt-1 block text-[9px] text-muted">
                        {artist.meta}
                      </span>
                    </span>
                    <span className="font-label hidden text-[9px] text-dim sm:block">
                      {artist.period} <span className="pill-arrow ml-4 text-teal-bright">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
