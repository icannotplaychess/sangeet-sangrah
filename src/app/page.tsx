import Link from "next/link";
import { PillLink, SectionLabel, MetaRow } from "@/components/ui";
import RandomButton from "@/components/RandomButton";
import { allArtists, songs, facts, getSong } from "@/lib/content";

function dayOfYear(): number {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  return Math.floor((now.getTime() - start) / 86400000);
}

export default function Home() {
  const day = dayOfYear();
  const featuredArtist = allArtists[day % allArtists.length];
  const featuredSong = getSong("kevha-tari-pahate") ?? songs[0];
  const meaningSong = getSong("mogara-phulala") ?? songs[day % songs.length];
  const fact = facts[day % facts.length];

  return (
    <>
      {/* ——— HERO ——— */}
      <section className="atmosphere relative min-h-[92vh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        >
          <div className="flex flex-col items-center gap-2 opacity-[0.04]">
            {["स्वर", "शब्द", "स्मृती", "कविता"].map((w) => (
              <span key={w} className="font-deva text-[12vw] font-light leading-none text-pale">
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-5 py-28 md:px-8">
          <p className="font-label animate-fade-in text-[10px] text-muted">
            मराठी संगीत • कविता • साहित्य • स्मृती
          </p>

          <div className="mt-16 animate-fade-up">
            <h1 className="font-deva text-[clamp(4rem,14vw,11rem)] font-light leading-[0.9] tracking-tight text-muted">
              संगीत
            </h1>
            <p className="font-deva -mt-2 text-[clamp(3.5rem,12vw,9rem)] font-light leading-[0.95] text-pale">
              <span className="deva-oblique inline-block">संग्रह</span>
              <span className="text-teal-bright">.</span>
            </p>
          </div>

          <div className="mt-16 max-w-xl animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <p className="font-deva text-lg font-light leading-relaxed text-pale md:text-xl">
              मराठी संगीताची स्मृती जपणारा एक डिजिटल संग्रह.
            </p>
            <p className="font-deva mt-4 text-sm font-light leading-loose text-muted md:text-base">
              गायक, संगीतकार, गीतकार, कवी, गीते, कविता आणि त्यामागच्या कथा — एका ठिकाणी.
            </p>
          </div>

          <div
            className="mt-14 flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <PillLink href="/sangrah" primary>
              संग्रहात प्रवेश करा
            </PillLink>
            <PillLink href="/tathya">आजचा तथ्य</PillLink>
          </div>

          <p className="mt-24 font-label text-[9px] text-dim">स्वर. शब्द. स्मृती.</p>
        </div>
      </section>

      {/* ——— आजचा संग्रह ——— */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <SectionLabel>आजचा संग्रह</SectionLabel>
          <div className="mt-12 grid gap-16 md:grid-cols-[1fr_1.4fr] md:gap-24">
            <div>
              <p className="font-label text-[10px] text-teal-bright">आजचा कलाकार</p>
              <Link href={`/kalakar/${featuredArtist.slug}`} className="group mt-4 block">
                <h2 className="font-deva text-4xl font-medium text-pale transition-colors group-hover:text-teal-bright md:text-5xl">
                  {featuredArtist.name}
                </h2>
                <p className="font-label mt-4 text-[10px] text-muted">{featuredArtist.meta}</p>
              </Link>
            </div>
            <div>
              <p className="font-deva text-base font-light leading-[2] text-pale-2">
                {featuredArtist.intro[0]}
              </p>
              <Link
                href={`/kalakar/${featuredArtist.slug}`}
                className="font-label mt-8 inline-flex items-center gap-2 text-[10px] text-teal-bright link-quiet"
              >
                अधिक वाचा <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ——— आजचे गीत ——— */}
      <section className="border-t hairline bg-ink-2/40">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <SectionLabel>आजचे गीत</SectionLabel>
          <div className="mt-12">
            <p className="font-label text-[10px] text-muted">गीत</p>
            <Link href={`/geete/${featuredSong.slug}`} className="group mt-3 block">
              <h2 className="font-deva text-3xl font-medium text-pale transition-colors group-hover:text-teal-bright md:text-4xl">
                {featuredSong.title}
              </h2>
            </Link>

            <dl className="mt-10 max-w-md">
              <MetaRow label="गीतकार" value={featuredSong.lyricist} />
              <MetaRow label="संगीतकार" value={featuredSong.composer} />
              <MetaRow label="गायक" value={featuredSong.singers.join(", ")} />
              {featuredSong.filmOrAlbum && (
                <MetaRow label="चित्रपट / अल्बम" value={featuredSong.filmOrAlbum} />
              )}
              {featuredSong.year && <MetaRow label="वर्ष" value={featuredSong.year} />}
            </dl>

            <div className="mt-12 max-w-2xl">
              <p className="font-label text-[10px] text-teal-bright">या गीतामागची कथा</p>
              <p className="font-deva mt-4 text-base font-light leading-[2] text-pale-2">
                {featuredSong.context[0]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— शब्दांचा अर्थ ——— */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <SectionLabel>शब्दांचा अर्थ</SectionLabel>
          <div className="mt-12">
            <p className="font-label text-[10px] text-muted">भावार्थ</p>
            <Link href={`/geete/${meaningSong.slug}`} className="group mt-3 block">
              <h2 className="font-deva text-2xl font-medium text-pale transition-colors group-hover:text-teal-bright md:text-3xl">
                &ldquo;{meaningSong.title}&rdquo;
              </h2>
            </Link>

            <div className="mt-10 grid gap-12 md:grid-cols-2">
              <div>
                <p className="font-label text-[9px] text-dim">गीताचा संदर्भ</p>
                <p className="font-deva mt-3 text-sm font-light leading-loose text-pale-2">
                  {meaningSong.context[0]}
                </p>
              </div>
              <div>
                <p className="font-label text-[9px] text-dim">प्रमुख भाव</p>
                <p className="font-deva mt-3 text-sm font-light leading-loose text-pale-2">
                  {meaningSong.meaning[0]}
                </p>
              </div>
              {meaningSong.excerpt && (
                <div className="md:col-span-2">
                  <p className="font-label text-[9px] text-dim">अल्प अंश (समीक्षेसाठी)</p>
                  <blockquote className="font-deva mt-4 border-l border-teal/30 pl-6 text-lg font-light italic leading-loose text-pale">
                    {meaningSong.excerpt[0]}
                  </blockquote>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="font-label text-[9px] text-dim">सांस्कृतिक संदर्भ</p>
                <p className="font-deva mt-3 text-sm font-light leading-loose text-pale-2">
                  {meaningSong.culturalContext[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— आजचा तथ्य + काहीही उघडा ——— */}
      <section className="border-t hairline bg-ink-2/40">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <div className="grid gap-20 md:grid-cols-2">
            <div>
              <SectionLabel>आजचा तथ्य</SectionLabel>
              <blockquote className="font-deva mt-10 text-lg font-light leading-[2] text-pale md:text-xl">
                {fact.text}
              </blockquote>
              <Link
                href="/tathya"
                className="font-label mt-8 inline-flex items-center gap-2 text-[10px] text-teal-bright link-quiet"
              >
                आणखी एक तथ्य <span>→</span>
              </Link>
            </div>
            <div>
              <SectionLabel>काहीही उघडा</SectionLabel>
              <p className="font-deva mt-10 text-base font-light leading-loose text-pale-2">
                कलाकार, गीत, कविता, इतिहास किंवा तथ्य — संग्रहातून एक यादृच्छिक द्वार उघडा.
              </p>
              <div className="mt-10">
                <RandomButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
