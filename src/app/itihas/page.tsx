import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui";
import { eras, films, ragas, instruments } from "@/lib/content";

export const metadata: Metadata = {
  title: "संगीताचा इतिहास",
  description: "मराठी संगीताचा कालक्रम — संतसंगीत, नाट्यसंगीत, भावगीत आणि लोकसंगीत.",
};

export default function ItihasPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">कालखंड • परंपरा • परिवर्तन</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        संगीताचा इतिहास<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-7 max-w-2xl text-base font-light leading-loose text-pale-2">
        लोकसंगीत, नाट्यसंगीत, भावगीत, भक्तिगीत, चित्रपटसंगीत आणि आधुनिक मराठी
        संगीत — आठ शतकांचा प्रवास.
      </p>

      {/* Timeline */}
      <section className="mt-24">
        <SectionLabel>कालरेखा</SectionLabel>
        <div className="mt-12 border-l hairline">
          {eras.map((era) => (
            <article
              key={era.slug}
              id={era.slug}
              className="relative scroll-mt-24 pb-20 pl-10 last:pb-0"
            >
              <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border border-teal-bright bg-ink glow-dot" />
              <p className="font-label text-[10px] text-teal-bright">{era.period}</p>
              <h2 className="font-deva mt-2 text-3xl font-medium text-pale md:text-4xl">
                {era.name}
              </h2>
              <p className="font-deva mt-4 max-w-2xl text-base font-light leading-loose text-pale-2">
                {era.summary}
              </p>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  {era.description.map((p) => (
                    <p
                      key={p.slice(0, 40)}
                      className="font-deva mb-4 text-sm font-light leading-loose text-muted"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="font-label text-[9px] text-dim">महत्त्वाचे कलाकार</p>
                    <p className="font-deva mt-2 text-sm font-light text-pale-2">
                      {era.keyArtists.join(" • ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-label text-[9px] text-dim">महत्त्वाची गीते / रचना</p>
                    <p className="font-deva mt-2 text-sm font-light text-pale-2">
                      {era.keySongs.join(" • ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-label text-[9px] text-dim">महत्त्वाचे बदल</p>
                    <ul className="font-deva mt-2 space-y-1 text-sm font-light text-muted">
                      {era.changes.map((c) => (
                        <li key={c}>— {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Films */}
      <section id="chitrapat" className="mt-32 scroll-mt-24">
        <SectionLabel>चित्रपटसंगीत</SectionLabel>
        <div className="mt-8">
          {films.map((film) => (
            <div key={film.slug} className="border-b hairline py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h3 className="font-deva text-xl font-medium text-pale">{film.title}</h3>
                <span className="font-label text-[9px] text-dim">{film.year}</span>
              </div>
              {film.director && (
                <p className="font-label mt-1 text-[9px] text-muted">दिग्दर्शन: {film.director}</p>
              )}
              {film.composer && (
                <p className="font-label text-[9px] text-muted">संगीत: {film.composer}</p>
              )}
              <p className="font-deva mt-3 text-sm font-light leading-loose text-pale-2">
                {film.note[0]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ragas */}
      <section id="raag" className="mt-32 scroll-mt-24">
        <SectionLabel>राग</SectionLabel>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ragas.map((raga) => (
            <div key={raga.slug} className="border hairline rounded-2xl p-6">
              <h3 className="font-deva text-xl font-medium text-pale">राग {raga.name}</h3>
              <p className="font-label mt-2 text-[9px] text-teal-bright">{raga.mood}</p>
              {raga.thaat && (
                <p className="font-label mt-1 text-[9px] text-dim">थाट: {raga.thaat}</p>
              )}
              {raga.time && (
                <p className="font-label text-[9px] text-dim">वेळ: {raga.time}</p>
              )}
              <p className="font-deva mt-4 text-sm font-light leading-loose text-muted">
                {raga.description[0]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Instruments */}
      <section id="vadya" className="mt-32 scroll-mt-24 pb-16">
        <SectionLabel>वाद्ये</SectionLabel>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {instruments.map((inst) => (
            <div key={inst.slug} className="border-b hairline pb-6">
              <h3 className="font-deva text-lg font-medium text-pale">{inst.name}</h3>
              <p className="font-label mt-1 text-[9px] text-muted">{inst.kind}</p>
              <p className="font-deva mt-3 text-sm font-light leading-loose text-pale-2">
                {inst.description}
              </p>
              <p className="font-label mt-2 text-[9px] text-dim">{inst.context}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
