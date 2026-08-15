import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui";
import { allArtists, songs, poems, eras } from "@/lib/content";

export const metadata: Metadata = {
  title: "संग्रह",
  description: "मराठी संगीत, कविता आणि साहित्याचा डिजिटल संग्रह — कलाकार, गीते, कविता आणि इतिहास.",
};

const sections = [
  { href: "/kalakar", label: "कलाकार", count: allArtists.length, desc: "गायक, संगीतकार, गीतकार, कवी" },
  { href: "/geete", label: "गीते", count: songs.length, desc: "भावगीत, चित्रपटगीत, अभंग, गझल" },
  { href: "/kavita", label: "कविता", count: poems.length, desc: "निसर्ग, भक्ती, जीवनविचार" },
  { href: "/shayari", label: "शायरी", count: 9, desc: "प्रेम, विरह, पाऊस, आठवणी" },
  { href: "/itihas", label: "इतिहास", count: eras.length, desc: "संतसंगीत ते आधुनिक भावगीत" },
  { href: "/quiz", label: "क्विझ", count: null, desc: "मराठी संगीताची चाचणी" },
  { href: "/tathya", label: "तथ्य", count: null, desc: "आजचा तथ्य आणि संग्रह" },
  { href: "/shodh", label: "शोध", count: null, desc: "संपूर्ण संग्रहात शोधा" },
];

export default function SangrahPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">संग्रह</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        संगीत संग्रह<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-8 max-w-2xl text-base font-light leading-loose text-pale-2">
        मराठी संगीत, कविता आणि साहित्य यांची स्मृती जपणारा एक डिजिटल संग्रह. लता मंगेशकर, सुधीर फडके,
        ग. दि. माडगूळकर, संत ज्ञानेश्वर — अशा कलाकारांच्या कथा, गीते आणि कविता एका ठिकाणी.
      </p>

      <div className="mt-20 grid gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-ink p-8 transition-colors hover:bg-ink-2"
          >
            <p className="font-label text-[9px] text-dim">
              {s.count !== null ? `${s.count} लेख` : "वैशिष्ट्य"}
            </p>
            <h2 className="font-deva mt-3 text-2xl font-medium text-pale transition-colors group-hover:text-teal-bright">
              {s.label}
            </h2>
            <p className="font-deva mt-2 text-sm font-light text-muted">{s.desc}</p>
            <span className="font-label mt-6 inline-block text-[9px] text-teal-bright opacity-0 transition-opacity group-hover:opacity-100">
              प्रवेश करा →
            </span>
          </Link>
        ))}
      </div>

      <div id="aamchyabaddal" className="mt-32 scroll-mt-24">
        <SectionLabel>आमच्याबद्दल</SectionLabel>
        <p className="font-deva mt-8 max-w-3xl text-base font-light leading-[2] text-pale-2">
          संगीत संग्रह हा मराठी संगीत, कविता आणि साहित्यासाठीचा एक शैक्षणिक डिजिटल संग्रह आहे. हे
          Wikipedia सारखे नव्हे — हे एक संपादकीय सांस्कृतिक वाचनालय आहे. लता मंगेशकर, सुधीर फडके,
          श्रीनिवास खळे, संत तुकाराम अशा कलाकारांच्या कथा, गीते आणि कविता येथे एकत्रित केल्या आहेत.
        </p>
      </div>

      <div id="srot" className="mt-20 scroll-mt-24">
        <SectionLabel>स्रोत</SectionLabel>
        <ul className="font-deva mt-6 space-y-2 text-sm font-light text-muted">
          <li>• आकाशवाणी पुणे — गीतरामायण प्रसारणाची ऐतिहासिक माहिती</li>
          <li>• संगीत नाटक अकादमी, नवदेवी प्रकाशन — कलाकार चरित्र</li>
          <li>• ज्ञानेश्वरी, तुकाराम गाथा — सार्वजनिक संतकाव्य</li>
          <li>• चित्रपटसंगीत आणि भावगीत ध्वनिमुद्रिका — गीत माहिती</li>
        </ul>
      </div>

      <div id="yogdan" className="mt-20 scroll-mt-24">
        <SectionLabel>योगदान</SectionLabel>
        <p className="font-deva mt-6 text-sm font-light leading-loose text-muted">
          हा संग्रह सतत वाढत आहे. कलाकार, गीत, कविता किंवा तथ्य सुचवण्यासाठी संपर्क विभागात लिहा.
        </p>
      </div>

      <div id="sampark" className="mt-20 scroll-mt-24">
        <SectionLabel>संपर्क</SectionLabel>
        <p className="font-deva mt-6 text-sm font-light text-muted">
          संगीत संग्रह — मराठी संगीताचा डिजिटल संग्रह
        </p>
      </div>
    </div>
  );
}
