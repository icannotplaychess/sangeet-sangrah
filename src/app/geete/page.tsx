import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui";
import { getPublishedSongs } from "@/lib/repository";

export const metadata: Metadata = {
  title: "गीते",
  description: "मराठी भावगीते, चित्रपटगीते, अभंग, नाट्यगीते आणि गझल यांचा संदर्भसंग्रह.",
};

export default async function SongsPage() {
  const songs = await getPublishedSongs();
  const types = Array.from(new Set(songs.map((song) => song.type)));

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">शब्द • स्वर • संदर्भ</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        गीते<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-7 max-w-2xl text-base font-light leading-loose text-pale-2">
        मराठी भावगीताच्या सुवर्णकाळातील निवडक गीते — गीतामागची कथा, भावार्थ, संगीतविश्लेषण आणि
        सांस्कृतिक संदर्भांसह.
      </p>

      <div className="mt-14 flex flex-wrap gap-2">
        {types.map((type) => (
          <span key={type} className="rounded-full border hairline px-4 py-2 font-label text-[9px] text-muted">
            {type}
          </span>
        ))}
      </div>

      <section className="mt-24">
        <SectionLabel>{songs.length} निवडक गीते</SectionLabel>
        <div className="mt-8">
          {songs.map((song, index) => (
            <Link
              key={song.slug}
              href={`/geete/${song.slug}`}
              className="group grid gap-4 border-b hairline py-6 sm:grid-cols-[3rem_1fr_1fr_auto] sm:items-baseline"
            >
              <span className="font-label text-[9px] text-dim">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="font-deva block text-xl font-medium text-pale transition-colors group-hover:text-teal-bright md:text-2xl">
                  {song.title}
                </span>
                {song.latinTitle && (
                  <span className="font-editorial mt-1 block text-sm italic text-dim">{song.latinTitle}</span>
                )}
              </span>
              <span className="font-deva text-sm font-light leading-relaxed text-muted">
                {song.singers.join(", ")}
                <br />
                <span className="text-dim">{song.composer}</span>
              </span>
              <span className="font-label text-[9px] text-dim">
                {song.year ?? "—"} <span className="pill-arrow ml-3 text-teal-bright">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
